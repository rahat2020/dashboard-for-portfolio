import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FileText, Folder, Briefcase, Users as UsersIcon, Check } from "react-feather";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../features/notifications/notificationsApi";

const typeMeta = {
  post: { icon: FileText, path: (id) => `/posts/${id}` },
  project: { icon: Folder, path: (id) => `/projects/${id}` },
  experience: { icon: Briefcase, path: () => "/experiences" },
  admin: { icon: UsersIcon, path: () => "/users" },
};

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const { data: countData } = useGetUnreadCountQuery();
  const { data: notifData } = useGetNotificationsQuery({ limit: 10 });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const unreadCount = countData?.data?.count || 0;
  const notifications = notifData?.data || [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification._id);
    const meta = typeMeta[notification.type];
    if (meta) navigate(meta.path(notification.relatedId));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-semibold text-white bg-violet-500 rounded-full ring-2 ring-gray-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-30">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-200">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 cursor-pointer"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications yet</p>
          ) : (
            <ul className="py-1">
              {notifications.map((n) => {
                const Icon = typeMeta[n.type]?.icon || Bell;
                return (
                  <li key={n._id}>
                    <button
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors cursor-pointer ${
                        !n.isRead ? "bg-gray-800/40" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-200 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.isRead && <span className="w-2 h-2 mt-1.5 bg-violet-500 rounded-full shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
