import { createContext, useState } from "react";

export const DetectContext = createContext({
  image: null,
  setImage: () => { },
  file: null,
  setFile: () => { },
  size: null,
  setSize: () => { },
});

export const AuthContext = createContext({
  userid: null,
  setUserid: () => { },
  passwd: null,
  setPasswd: () => { },
  token: null,
  setToken: () => { },
});

export default function ContextProvider({ children }) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [size, setSize] = useState(null);

  const [userid, setUserid] = useState(null);
  const [passwd, setPasswd] = useState(null);
  const [token, setToken] = useState(true);

  return <>
    <DetectContext.Provider value={{ image, setImage, file, setFile, size, setSize }}>
      <AuthContext.Provider value={{ userid, setUserid, passwd, setPasswd, token, setToken }}>
        {children}
      </AuthContext.Provider>
    </DetectContext.Provider>
  </>
}
