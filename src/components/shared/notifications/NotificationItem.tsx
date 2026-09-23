import { Link } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import type { INotificationWithActor } from "@/types";

type NotificationItemProps = {
  notification: INotificationWithActor;
};

const MESSAGES: Record<INotificationWithActor["type"], string> = {
  follow: "started following you",
  like: "liked your post",
  comment: "commented on your post",
  reply: "replied to your comment",
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  if (!notification.actor) return null; // deleted-actor edge case

  const { actor, type, postId, $createdAt } = notification;
  const linkTo = type === "follow" ? `/profile/${actor.$id}` : `/post/${postId}`;

  return (
    <Link to={linkTo} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-3 transition-colors">
      <img src={actor.imageUrl} alt={actor.name} className="w-10 h-10 rounded-full object-cover" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">
          <span className="font-semibold">{actor.name}</span> {MESSAGES[type]}
        </p>
        <p className="text-xs text-light-3">{multiFormatDateString($createdAt)}</p>
      </div>
    </Link>
  );
};

export default NotificationItem;