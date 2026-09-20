import { Client, Databases, Query, Permission, Role, ID } from 'node-appwrite';

const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '69e3c340000f6996ebc6';
const DATABASE_ID = '6a27ca0b0011cdc4840d';

const USERS_COLLECTION_ID = 'users';
const POSTS_COLLECTION_ID = 'posts';
const FOLLOWS_COLLECTION_ID = 'follows';
const LIKES_COLLECTION_ID = 'likes'; // also holds comments/replies — see resolveNotification()
const NOTIFICATIONS_COLLECTION_ID = 'notifications';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const databases = new Databases(client);
  const event = req.headers['x-appwrite-event'] ?? '';
  const payload = req.bodyJson;

  // Used for both "like" and top-level "comment" notifications.
  async function getPostOwnerId(postId) {
    const posts = await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID, [
      Query.equal('$id', postId),
      Query.select(['creator.$id']),
    ]);
    return posts.documents[0]?.creator?.$id;
  }

  // Figures out what kind of notification this event should produce, and who gets it.
  // Returns null if the event isn't one we care about.
  async function resolveNotification() {
    if (event.includes(`.tables.${FOLLOWS_COLLECTION_ID}.rows.`)) {
      return {
        type: 'follow',
        actorId: payload.followerId,
        recipientId: payload.followingId,
        postId: null,
      };
    }

    if (event.includes(`.tables.${LIKES_COLLECTION_ID}.rows.`)) {
      const actorId = payload.userId;
      const postId = payload.postId;
      const isReply = !!payload.content && !!payload.parentCommentId;
      const isComment = !!payload.content && !payload.parentCommentId;

      if (isReply) {
        const parentComment = await databases.getDocument(DATABASE_ID, LIKES_COLLECTION_ID, payload.parentCommentId);
        return { type: 'reply', actorId, recipientId: parentComment.userId, postId };
      }

      if (isComment) {
        return { type: 'comment', actorId, recipientId: await getPostOwnerId(postId), postId };
      }

      return { type: 'like', actorId, recipientId: await getPostOwnerId(postId), postId };
    }

    return null;
  }

  try {
    const notification = await resolveNotification();

    if (!notification) {
      log(`Ignoring unrelated event: ${event}`);
      return res.json({ skipped: true });
    }

    const { type, actorId, recipientId, postId } = notification;

    if (!recipientId || actorId === recipientId) {
      log('Skipping: missing recipient or self-action');
      return res.json({ skipped: true });
    }

    const recipientUser = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, recipientId);

    await databases.createDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      ID.unique(),
      { type, recipientId, actorId, postId, isRead: false },
      [
        Permission.read(Role.user(recipientUser.accountId)),
        Permission.update(Role.user(recipientUser.accountId)),
      ]
    );

    log(`Notification created: ${type} -> ${recipientId}`);
    return res.json({ success: true });
  } catch (e) {
    error('Failed to create notification: ' + e.message);
    error('Cause: ' + JSON.stringify(e.cause));
    return res.json({ success: false, error: e.message, cause: e.cause?.message ?? null }, 500);
  }
};