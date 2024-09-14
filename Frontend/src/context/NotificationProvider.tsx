import { ReactNode, createContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface NotificationType {
  updateNotification: (type: string, value: string) => void;
}

export const NotificationContext = createContext<NotificationType | undefined>(
  undefined
);

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const updateNotification = (type: string, value: string) => {
    switch (type) {
      case "error":
        toast.error(value);
        break;
      case "success":
        toast.success(value);
        break;
      case "warning":
        toast.warning(value);
        break;
      default:
        toast.info(value);
    }
  };

  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </NotificationContext.Provider>
  );
}
