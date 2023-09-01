import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Paper, TextField, Button } from "@mui/material";
import axios from "axios";

import { AuthContext } from "../../base/contexts/auth";
import { NotificationContext } from "../../base/contexts/notification";
import endpoints from "../../base/endpoints.json";
import Protected from "../../layout/protected";

export default function DatabaseAddPage() {
  const navigate = useNavigate();
  const { CSRFtoken } = useContext(AuthContext);
  const { setType, setMessage } = useContext(NotificationContext);

  const [Title, setTitle] = useState("");
  const [Country, setCountry] = useState("");
  const [Class_of_album, setClass_of_album] = useState("");

  const handleFormSubmit = e => {
    e.preventDefault();
    const URL = endpoints.baseurl + endpoints.database + "create/";
    const data = new FormData();
    data.append("title", Title);
    data.append("country", Country);
    data.append("class_of_album", Class_of_album);
    data.append("csrfmiddlewaretoken", CSRFtoken);
    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken,
      }
    };
    axios.post(URL, data, config).then(res => {
      navigate("/database/view/" + res.data.id);
    }).catch(err => {
      setType("error");
      setMessage(`Unable to add. ${err.response?.data ?? err.message}`);
    });
  };

  return <Protected>
    <Box component={Paper} style={{ padding: 16 }} marginY={2}>
      <Grid
        container spacing={2}
        component="form"
        onSubmit={handleFormSubmit}
      >
        <Grid item xs={12}>
          <TextField
            label="Name of Object" value={Title}
            variant="filled" color="info" margin="normal"
            required fullWidth
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Country" value={Country}
            variant="filled" color="info" margin="normal"
            required fullWidth
            onChange={(e) => setCountry(e.target.value)}
            type="text" // Explicitly set the type to "text"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Class of Object" value={Class_of_album}
            variant="filled" color="info" margin="normal"
            required fullWidth
            onChange={(e) => setClass_of_album(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button variant="contained" color="secondary" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Protected>
};
