import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { selectCurrentToken } from "../features/auth/authSlice";
import { apiSlice } from "../services/apiSlice";

// Socket.io is attached to the bare HTTP server, not under /api/v1 — strip the API path.
const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api\/v\d+\/?$/, "");

/**
 * Opens a Socket.io connection authenticated with the admin JWT and keeps the
 * notifications RTK Query cache (list + unread count) in sync in real time.
 */
const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });

    socket.on("notification:new", (notification) => {
      // Refetch every active notifications list/count query regardless of its
      // arguments (e.g. { limit: 10 }) — a manual cache patch only updates the
      // exact arg it targets, so it silently misses differently-keyed queries.
      dispatch(
        apiSlice.util.invalidateTags([
          { type: "Notifications", id: "LIST" },
          { type: "Notifications", id: "COUNT" },
        ])
      );

      toast(notification.message, { icon: "🔔" });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, dispatch]);
};

export default useNotificationSocket;
