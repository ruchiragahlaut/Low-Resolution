import { Button, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { getCookie } from "../base/utils";
import { AuthContext } from "../base/contexts/auth";
import endpoints from "../base/endpoints.json";

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    Username, setUsername,
    CSRFtoken, setCSRFtoken,
    Status, setStatus
  } = useContext(AuthContext);
  const [Password, setPassword] = useState(null);

  function updateCSRF() {
    const URL = endpoints.baseurl + endpoints.auth.session.new;
    axios.get(URL, { withCredentials: true }).then(res => {
      setCSRFtoken(getCookie("csrftoken"));
    }).catch(err => {
      console.info(err);
    });
  }

  useEffect(() => {
    if (Status) navigate("/");
    if (CSRFtoken) return;

    updateCSRF();
  });

  const handleUsername = e => setUsername(e.target.value);
  const handlePassword = e => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const URL = endpoints.baseurl + endpoints.auth.session.login;
    const payload = new FormData();
    payload.append("username", Username);
    payload.append("password", Password);
    payload.append("csrfmiddlewaretoken", CSRFtoken);
    payload.append("next", endpoints.baseurl + endpoints.auth.session.validate);
    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken
      }
    }

    axios.post(URL, payload, config).then(res => {
      if (res.status === 201) {
        setStatus(res.status === 201);
        navigate("/");
      } else {
        updateCSRF();
      }
    }).catch(err => {
      console.info(err);
      updateCSRF();
    });
  };

  return <Box component="form" padding={3} onSubmit={handleSubmit}>

    <TextField
      required fullWidth
      label="Username" onChange={handleUsername}
      variant="filled" color="info" margin="normal"
    />

    <TextField
      required fullWidth
      label="Password" type="password" onChange={handlePassword}
      autoComplete="current-password"
      variant="filled" color="info" margin="normal"
    />

    <Button
      type="submit"
      variant="contained" color="secondary"
      fullWidth
    >
      Sign In
    </Button>
  </Box>
}
