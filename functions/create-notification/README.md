# create-notification

Appwrite event function that creates notification documents for follow, like,
comment, reply, and mention activity.

## Events

The function reads the Appwrite event name from the `x-appwrite-event` request
header and the event document from `req.bodyJson`. It handles row events for:

- `follows`: creates a follow notification.
- `likes`: creates like, comment, or reply notifications. The `likes` collection
  also stores comments and replies, so the payload's `content` and
  `parentCommentId` fields determine the activity type.
- `posts`: creates notifications for usernames mentioned in a post caption.

Mentions in comments and replies also create mention notifications. The handler
ignores self-notifications and events that produce no notifications.

For post deletion events, the handler is intended to remove related likes and
notifications without creating a notification. The current deletion branch
references `postId` before it is defined, so deletion cleanup will fail until
that handler issue is fixed.

## Configuration

| Setting | Value |
| --- | --- |
| Runtime | Node.js 18 |
| Entrypoint | `src/main.js` |
| Build command | `npm install` |

The Appwrite endpoint, project ID, database ID, and collection IDs are
configured as constants in `src/main.js`. No environment variables are
required. The handler initializes its Appwrite client using the
`x-appwrite-key` request header.

## Responses

- `200` with `{ "success": true }` after processing notifications, or
  `{ "skipped": true }` when there is nothing to create.
- `500` with an error message if processing fails.

## Local commands

Install dependencies:

```sh
npm install
```

Check formatting:

```sh
npm exec -- prettier --check src/main.js
```
