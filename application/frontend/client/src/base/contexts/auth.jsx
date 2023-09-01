import { createContext, useEffect, useState } from "react";
import axios from "axios";

import { getCookie } from "../utils";
import endpoints from "../endpoints.json";

export const AuthContext = createContext({
  Username: null, setUsername: () => { },
  CSRFtoken: null, setCSRFtoken: () => { },
  Status: null, setStatus: () => { },
});

export default function AuthContextProvider({ children }) {
  const [Username, setUsername] = useState(null);
  const [CSRFtoken, setCSRFtoken] = useState(null);
  const [Status, setStatus] = useState(false);

  useEffect(() => {
    const URL = endpoints.baseurl + endpoints.auth.session.validate;
    setCSRFtoken(getCookie("csrftoken"));
    axios.get(URL, { withCredentials: true }).then(res => {
      setStatus(res.status === 201);
    }).catch(err => {
      // Ignore error
    });
  }, []);

  return <AuthContext.Provider
    value={{
      Username, setUsername,
      CSRFtoken, setCSRFtoken,
      Status, setStatus,
    }}>
    {children}
  </AuthContext.Provider>
}
