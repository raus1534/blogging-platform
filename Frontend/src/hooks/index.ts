import { useContext } from "react";

import {
  NotificationContext,
  NotificationType,
} from "../context/NotificationProvider";
import { AuthContext } from "../context/AuthProvider";

export const useNotification = () =>
  useContext(NotificationContext) as NotificationType;
export const useAuth = () => useContext(AuthContext);
