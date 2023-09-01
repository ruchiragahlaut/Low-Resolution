import { useContext } from "react";
import { Grid, Paper, Button, } from "@mui/material";
import axios from "axios";

import { NotificationContext } from "../base/contexts/notification";
import Protected from "../layout/protected";
import endpoints from "../base/endpoints";

const styles = {
  padding: 12
}

export default function RetrainPage() {
  const { setMessage, setType } = useContext(NotificationContext);

  function retrain() {
    const URL = endpoints.baseurl + endpoints.ml.retrain;
    axios.get(URL, { withCredentials: true })
      .then(res => {
        setType("info");
        setMessage(res.data);
      }).catch(err => {
        setType("error");
        setMessage(err.response?.data ?? err.message);
      });
  }

  return <Protected>
    <Grid container component={Paper} marginY={2} style={styles}>
      Retrain the model for the new images in the database.
    </Grid>
    <Grid component={Paper}>
      <Button
        variant="contained"
        color="secondary"
        onClick={retrain}
      >
        Retrain Model
      </Button>
    </Grid>
  </Protected>
}
