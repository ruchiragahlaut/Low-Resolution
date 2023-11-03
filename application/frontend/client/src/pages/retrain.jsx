import { useContext, useState, useEffect, useRef } from "react";
import { Grid, Paper, Button, LinearProgress } from "@mui/material";

import { NotificationContext } from "../base/contexts/notification";
import Protected from "../layout/protected";
import endpoints from "../base/endpoints";

const styles = {
  padding: 12
}

export default function RetrainPage() {
  const { setMessage, setType } = useContext(NotificationContext);

  const [Logs, setLogs] = useState([]);
  const bottomRef = useRef();

  // Scroll to bottom of logs
  useEffect(() => {
    if (Logs.length === 0) return;
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [Logs]);

  function retrain() {
    const URL = endpoints.baseurl + endpoints.ml.retrain;

    setType("info");
    setMessage("Model retraining in progress... Please wait for a few moments.");

    setLogs([]);

    // Make API call to ML endpoint
    // Response is a stream of status logs
    // Use FetchAPI because axios doesn't support streaming
    fetch(URL, { method: "GET", credentials: "include" })
      .then(res => {
        const stream = res.body.getReader();
        const decoder = new TextDecoder();

        const read = () => {
          stream.read().then(({ done, value }) => {
            if (done) {
              setType("success");
              setMessage("Model retraining completed.");
              return;
            }

            const log = decoder.decode(value)
              .split("<br />")
              .filter(log => log !== "");

            setLogs(prevLogs => [...prevLogs, ...log]);
            read();
          });
        }
        read();
      })
      .catch(err => {
        setType("error");
        setMessage("Failed to retrain model.");
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

    {Logs.length > 0 && <>
      <LinearProgress
        variant="determinate" color="secondary"
        // 8 masks * (1 * 2 models) + (3 + 5 top models)
        value={Logs.length * 100 / 32}
        style={{
          height: 12,
          width: "80%",
          margin: 12,
          backgroundColor: "black",
        }}
      />

      <Paper
        style={{
          padding: 12,
          margin: 12,
          width: "80%",
          backgroundColor: "#eee",
          maxHeight: 300,
          overflowY: "auto",
        }}
      >
        {Logs.map((log, index) => <>
          <span key={index}>{log}</span>
          <br />
        </>
        )}
        <span ref={bottomRef}></span>
      </Paper>
    </>}

  </Protected>
}
