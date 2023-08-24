import {
  Grid, Box, Paper, Button, Alert,
  Stack, Slider, Typography
} from "@mui/material";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { DetectContext } from "../base/contexts/detect";

const styles = {
  padding: 12
}

export default function DetectPage() {
  const navigate = useNavigate();

  const { image, file, size } = useContext(DetectContext);

  const [threshold, setThreshold] = useState(50);

  if (!image)
    return <Navigate to="/" />;

  return <>
    <Grid container rowGap={2} columnGap={4} paddingY={2}>
      <Grid item xs={8} container gap={4}>
        <Box
          style={{
            width: "100%"
          }}
        >
          <Grid container component={Paper} style={styles}>
            <Grid item xs={8} >
              Selected Image:
              <br />
              <br />
              <Box component={Paper} style={{ ...styles, width: "max-content" }}>
                {file} - {
                  (size > 1024 * 1024) ?
                    `${(size / 1024 / 1024).toFixed(2)} MiB`
                    : (size > 1024) ?
                      `${(size / 1024).toFixed(2)} KiB`
                      : `${size} Bytes`
                }
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                component="label"
                onClick={() => navigate("/")}
              >
                Select another image
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={3} component={Paper} style={styles}>
        <img
          src={image}
          alt="Uploaded"
          style={{
            width: "100%",
            height: "auto"
          }}
        />
      </Grid>

      <Grid item xs={8}>
        <Alert severity="success" icon={false}>
          Name of the object identified along with the Accuracy.
        </Alert>
      </Grid>

      <Grid item xs={3}>
        <Stack spacing={1} sx={{ mb: 1 }} alignItems="center">
          <Paper style={{ ...styles, width: "100%" }}>
            Accuracy Scale: {threshold}

            <Slider
              color="secondary"
              aria-label="accuracy scale"
              defaultValue={threshold}
              onChange={
                (e, v) => setThreshold(v)
              }
            />
          </Paper>
        </Stack>
      </Grid>

      <Grid item xs={12} component={Paper} style={styles}>
        <Typography variant="h6" style={{
          textAlign: "center"
        }}>
          Complete details of the object identified
        </Typography>
      </Grid>

    </Grid >
  </>;
}
