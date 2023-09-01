import AuthContextProvider from "../contexts/auth";
import DetectContextProvider from "../contexts/detect";
import NotificationContextProvider from "../contexts/notification";

export default function ContextProvider({ children }) {
  return <>
    <AuthContextProvider>
      <DetectContextProvider>
        <NotificationContextProvider>
          {children}
        </NotificationContextProvider>
      </DetectContextProvider>
    </AuthContextProvider>
  </>
}
