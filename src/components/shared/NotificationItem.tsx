import { Link } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import type { INotificationWithActor } from "@/types";

type NotificationItemProps = {
  notification: INotificationWithActor;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  if (!notification.actor) return null; // deleted-actor edge case from step 5

  const { actor, type, postId, $createdAt } = notification;
  const message = type === "follow" ? "started following you" : "liked your post";
  const linkTo = type === "follow" ? `/profile/${actor.$id}` : `/post/${postId}`;

  return (
    <Link to={linkTo} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-3 transition-colors">
      <img src={actor.imageUrl} alt={actor.name} className="w-10 h-10 rounded-full object-cover" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">
          <span className="font-semibold">{actor.name}</span> {message}
        </p>
        <p className="text-xs text-light-3">{multiFormatDateString($createdAt)}</p>
      </div>
    </Link>
  );
};

export default NotificationItem;