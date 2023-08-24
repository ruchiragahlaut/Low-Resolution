import { createContext, useState } from "react";

export const DetectContext = createContext({
  Imagebase64: null, setImagebase64: () => { },
  Filename: null, setFilename: () => { },
  Bytessize: null, setBytessize: () => { },
});

export default function DetectContextProvider({ children }) {
  const [Imagebase64, setImagebase64] = useState(null);
  const [Filename, setFilename] = useState(null);
  const [Bytessize, setBytessize] = useState(null);

  return <DetectContext.Provider
    value={{
      Imagebase64, setImagebase64,
      Filename, setFilename,
      Bytessize, setBytessize
    }}>
    {children}
  </DetectContext.Provider>
}
