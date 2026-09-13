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
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="relative"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src="/assets/icons/notification.svg"
          alt="notifications"
          className=" pt-2 size-16 cursor-pointer"
        />
        {!!unreadCount && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
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