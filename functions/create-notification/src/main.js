import { Client, Databases, Query, Permission, Role, ID } from 'node-appwrite';

const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '69e3c340000f6996ebc6';
const DATABASE_ID = '6a27ca0b0011cdc4840d';

const USERS_COLLECTION_ID = 'users';
const POSTS_COLLECTION_ID = 'posts';
const FOLLOWS_COLLECTION_ID = 'follows';
const LIKES_COLLECTION_ID = 'likes'; // also holds comments/replies
const NOTIFICATIONS_COLLECTION_ID = 'notifications';

const MENTION_PATTERN = /(?<![\w.])@([a-zA-Z0-9_.]+)/g;

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const databases = new Databases(client);
  const event = req.headers['x-appwrite-event'] ?? '';
  const payload = req.bodyJson;

  async function getPostOwnerId(postId) {
    const posts = await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID, [
      Query.equal('$id', postId),
      Query.select(['creator.$id']),
    ]);
    return posts.documents[0]?.creator?.$id;
  }

  async function extractMentionNotifications(text, actorId, postId) {
    const usernames = [...new Set([...text.matchAll(MENTION_PATTERN)].map((m) => m[1]))];
    log(`MENTION CHECK — text: ${JSON.stringify(text)} — usernames found: ${JSON.stringify(usernames)}`);
    if (usernames.length === 0) return [];

    const users = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
      Query.equal('username', usernames),
    ]);
    log(`MENTION CHECK — users resolved: ${JSON.stringify(users.documents.map((u) => u.username))}`);

    return users.documents.map((mentionedUser) => ({
      type: 'mention',
      actorId,
      recipientId: mentionedUser.$id,
      postId,
    }));
  }

  async function resolveNotifications() {
    if (event.includes(`.tables.${FOLLOWS_COLLECTION_ID}.rows.`)) {
      return [{
        type: 'follow',
        actorId: payload.followerId,
        recipientId: payload.followingId,
        postId: null,
      }];
    }

    if (event.includes(`.tables.${LIKES_COLLECTION_ID}.rows.`)) {
      const actorId = payload.userId;
      const postId = payload.postId;
      const isReply = !!payload.content && !!payload.parentCommentId;
      const isComment = !!payload.content && !payload.parentCommentId;

      if (isReply) {
        const parentComment = await databases.getDocument(DATABASE_ID, LIKES_COLLECTION_ID, payload.parentCommentId);
        const primary = { type: 'reply', actorId, recipientId: parentComment.userId, postId };
        return [primary, ...await extractMentionNotifications(payload.content, actorId, postId)];
      }

      if (isComment) {
        const primary = { type: 'comment', actorId, recipientId: await getPostOwnerId(postId), postId };
        return [primary, ...await extractMentionNotifications(payload.content, actorId, postId)];
      }

      return [{ type: 'like', actorId, recipientId: await getPostOwnerId(postId), postId }];
    }

    if (event.includes(`.tables.${POSTS_COLLECTION_ID}.rows.`)) {
      const actorId = payload.creator?.$id;
      const postId = payload.$id;
      return extractMentionNotifications(payload.caption ?? '', actorId, postId);
    }

    return [];
  }

  try {
    const notifications = await resolveNotifications();

    if (notifications.length === 0) {
      log(`No notifications to create for event: ${event}`);
      return res.json({ skipped: true });
    }

    for (const { type, actorId, recipientId, postId } of notifications) {
      if (!recipientId || actorId === recipientId) {
        log(`Skipping ${type}: missing recipient or self-action`);
        continue;
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
    }

    return res.json({ success: true });
  } catch (e) {
    error('Failed to create notification: ' + e.message);
    error('Cause: ' + JSON.stringify(e.cause));
    return res.json({ success: false, error: e.message, cause: e.cause?.message ?? null }, 500);
  }
};