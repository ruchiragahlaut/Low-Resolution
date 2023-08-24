import AuthContextProvider from "../contexts/auth";
import DetectContextProvider from "../contexts/detect";

export default function ContextProvider({ children }) {
  return <>
    <AuthContextProvider>
      <DetectContextProvider>
        {children}
      </DetectContextProvider>
    </AuthContextProvider>
  </>
}
