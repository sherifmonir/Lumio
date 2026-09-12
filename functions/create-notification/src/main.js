import { Client, Databases, Query, Permission, Role, ID } from 'node-appwrite';

const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '69e3c340000f6996ebc6';
const DATABASE_ID = '6a27ca0b0011cdc4840d';
const USERS_COLLECTION_ID = 'users';
const POSTS_COLLECTION_ID = 'posts';
const FOLLOWS_COLLECTION_ID = 'follows';
const LIKES_COLLECTION_ID = 'likes';
const NOTIFICATIONS_COLLECTION_ID = 'notifications';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const databases = new Databases(client);
  const event = req.headers['x-appwrite-event'] ?? '';
    log(`RAW EVENT: ${event}`);
  const payload = req.bodyJson;

  try {
    let type, recipientId, actorId;
    let postId = null;

    if (event.includes(`.tables.${FOLLOWS_COLLECTION_ID}.rows.`)) {
      type = 'follow';
      recipientId = payload.followingId;
      actorId = payload.followerId;
    } else if (event.includes(`.tables.${LIKES_COLLECTION_ID}.rows.`)) {
      type = 'like';
      actorId = payload.userId;
      postId = payload.postId;

      const posts = await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID, [
        Query.equal('$id', postId),
        Query.select(['creator.$id']),
      ]);
      recipientId = posts.documents[0]?.creator?.$id;
    } else {
      log(`Ignoring unrelated event: ${event}`);
      return res.json({ skipped: true });
    }

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
    return res.json({ success: false, error: e.message }, 500);
  }
};