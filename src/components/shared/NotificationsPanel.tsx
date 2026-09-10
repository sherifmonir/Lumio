import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import {
  useGetNotifications,
  useMarkAllNotificationsAsRead,
} from "@/lib/react-query/queriesAndMutatuins";
import NotificationItem from "./NotificationItem";

type NotificationsPanelProps = {
  userId: string;
  isOpen: boolean;
  className?: string;
};

const NotificationsPanel = ({ userId, isOpen, className }: NotificationsPanelProps) => {
  const { data, isLoading } = useGetNotifications(userId, isOpen);
  const { mutate: markAllRead } = useMarkAllNotificationsAsRead();

  useEffect(() => {
    if (isOpen) markAllRead(userId);
  }, [isOpen, markAllRead, userId]);

  const notifications = data?.pages.flatMap((page) => page.documents) ?? [];

  return (
    <div className={`bg-dark-2 rounded-xl shadow-lg w-80 max-h-96 overflow-y-auto z-50 ${className ?? ""}`}>
      <div className="px-4 py-3 border-b border-dark-4">
        <p className="text-white font-semibold">Notifications</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <ClipLoader />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-light-3 text-sm text-center py-6">No notifications yet</p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem key={notification.$id} notification={notification} />
        ))
      )}
    </div>
  );
};

export default NotificationsPanel;