import { useContext, useState } from "react";
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

  const [logs, setLogs] = useState("");

  function retrain() {
    const URL = endpoints.baseurl + endpoints.ml.retrain;
    setType("info");
    setMessage("Model retraining in progress... Please wait for a few moments.");
    setLogs("");

    // Make API call to ML endpoint
    // Response is a stream of status logs
    let stream;

    axios.get(URL, { withCredentials: true, responseType: "stream" })
      .then((response) => {
        stream = response.data;

        console.debug("Response:", response);
        console.debug("Stream:", stream);

        // TODO: Why is the stream plain text ?
        const text = stream.toString();
        setLogs(text);
        setType("success");
        setMessage("Model retraining completed.");

        // stream.on("data", (chunk) => {
        //   const data = JSON.parse(chunk.toString());
        //   setLogs((logs) => logs + data.message + "\n");
        // });
        // stream.on("end", () => {
        //   setType("success");
        //   setMessage("Model retraining completed.");
        // });
      }).catch((error) => {
        setType("error");
        setMessage("Model retraining failed.");
        console.log(error);
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

    <p
      style={{
        padding: 12,
        margin: 12,
        width: "80%",
        backgroundColor: "#eee",
      }}
    >
      Logs
      <br />
      {logs.split("<br />")
        .map((log, i) => <span key={i}>{log}<br /></span>)
      }
    </p>

  </Protected>
}
