import { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/UseUserContext";
import { useGetUnreadNotificationsCount } from "@/lib/react-query/queriesAndMutatuins";
import NotificationsPanel from "./NotificationsPanel";



const NotificationBell = () => {
  const { user } = useUserContext();
  const { data: unreadCount } = useGetUnreadNotificationsCount(user.id);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);


  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        type="button"
        className="relative inline-flex items-center justify-center p-1"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src="/assets/icons/notification.svg"
          alt="notifications"
          className=" w-14 h-14 cursor-pointer"
        />
        {!!unreadCount && (
          <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold leading-none rounded-full min-w-4 h-4 flex items-center justify-center px-1 border border-dark-2 pointer-events-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationsPanel userId={user.id} isOpen={isOpen}  />
      )}
    </div>
  );
};

export default NotificationBell;