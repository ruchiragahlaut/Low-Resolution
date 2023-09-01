import { createContext, useState } from "react";

export const DetectContext = createContext({
  ImageBin: null, setImageBin: () => { },
  Filename: null, setFilename: () => { },
  Bytessize: null, setBytessize: () => { },
  Predictions: null, setPredictions: () => { },
});

export default function DetectContextProvider({ children }) {
  const [ImageBin, setImageBin] = useState(null);
  const [Filename, setFilename] = useState(null);
  const [Bytessize, setBytessize] = useState(null);
  const [Predictions, setPredictions] = useState({});

  return <DetectContext.Provider
    value={{
      ImageBin, setImageBin,
      Filename, setFilename,
      Bytessize, setBytessize,
      Predictions, setPredictions,
    }}>
    {children}
  </DetectContext.Provider>
}
