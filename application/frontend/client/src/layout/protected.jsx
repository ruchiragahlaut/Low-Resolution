import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../base/contexts/auth";

export default function Protected({ children }) {
  const { Status } = useContext(AuthContext);
  if (Status)
    return children;

  return <Navigate to="/login" />
}
