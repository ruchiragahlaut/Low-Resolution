import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";

import { AuthContext } from "../base/contexts/auth";
import endpoints from "../base/endpoints.json";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { setStatus } = useContext(AuthContext);

  useEffect(() => {
    setStatus(false);
    const URL = endpoints.baseurl + endpoints.auth.session.logout;
    axios.get(URL, { withCredentials: true }).then(res => {
      navigate("/login");
    }).catch(err => {
      console.info(err);
    });
  });

  return <></>
}
