import { createContext, useState } from "react";

export const DetectContext = createContext({
  image: null,
  setImage: () => { },
  file: null,
  setFile: () => { },
  size: null,
  setSize: () => { },
});

export default function ContextProvider({ children }) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [size, setSize] = useState(null);

  return <>
    <DetectContext.Provider value={{ image, setImage, file, setFile, size, setSize }}>
      {children}
    </DetectContext.Provider>
  </>
}
