import { createContext, useState } from "react";

export const NotificationContext = createContext({
  Type: "", setType: () => { },
  Message: "", setMessage: () => { },
});

export default function NotificationContextProvider({ children }) {
  const [Type, setType] = useState("");
  const [Message, setMessage] = useState("");
  let timer = null;

  const setMessageTimed = (message) => {
    setMessage(message);
    clearTimeout(timer);
    if (message === "") return;
    timer = setTimeout(() => {
      setMessage("");
    }, 5000);
  }

  return <NotificationContext.Provider
    value={{
      Type, setType,
      Message, setMessage: setMessageTimed
    }}>
    {children}
  </NotificationContext.Provider>
}
