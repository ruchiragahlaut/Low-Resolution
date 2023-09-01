import {
  Grid, Box, Paper, Button, Alert,
  Stack, Slider, Typography
} from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useContext, useDeferredValue, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { DetectContext } from "../base/contexts/detect";

import Protected from "../layout/protected";

const styles = {
  padding: 12
}

export default function DetectPage() {
  const navigate = useNavigate();

  const {
    ImageBin, Filename, Bytessize,
    Predictions
  } = useContext(DetectContext);
  const {
    PredProba, Title, Country,
    Class_of_album, Weapons, Thumbnail,
  } = Predictions;

  let ImageURL;
  if (ImageBin)
    ImageURL = URL.createObjectURL(ImageBin);
  else
    ImageURL = null;


  const [threshold, setThreshold] = useState(50);
  const deferredThreshold = useDeferredValue(threshold);

  if (!ImageBin)
    return <Navigate to="/" />;

  return <Protected>
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
                {Filename} - {
                  (Bytessize > 1024 * 1024) ?
                    `${(Bytessize / 1024 / 1024).toFixed(2)} MiB`
                    : (Bytessize > 1024) ?
                      `${(Bytessize / 1024).toFixed(2)} KiB`
                      : `${Bytessize} Bytes`
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
          src={ImageURL}
          alt="Uploaded"
          style={{
            width: "100%",
            height: "auto"
          }}
        />
      </Grid>

      <Grid item xs={8}>
        <Alert severity={(PredProba && PredProba > deferredThreshold) ? "success" : "error"} icon={false}>
          Prediction: {Title} - {PredProba && PredProba.toFixed(2)}% Accuracy
        </Alert>
      </Grid>

      <Grid item xs={3}>
        <Stack spacing={1} sx={{ mb: 1 }} alignItems="center">
          <Paper style={{ ...styles, width: "100%" }}>
            Accuracy Scale: {deferredThreshold}

            <Slider
              color="secondary"
              aria-label="accuracy scale"
              defaultValue={deferredThreshold}
              onChange={
                (e, v) => setThreshold(v)
              }
            />
          </Paper>
        </Stack>
      </Grid>


      {
        (PredProba && PredProba > deferredThreshold) && <Grid item xs={12} container component={Paper} style={styles}>
          <Grid item xs={12} component={Typography} variant="h6" style={{
            textAlign: "center",
            margin: 12
          }}>
            Complete details of the object identified
          </Grid>

          <Grid item xs={6}>
            <Box component={Paper} style={{
              padding: 12,
              backgroundColor: "white"
            }}>
              {Title}
            </Box>
            <Box component={Paper} style={{
              padding: 12,
              marginBlock: 12,
              backgroundColor: "white"
            }}>
              Country: {Country}
            </Box>
            <Box component={Paper} style={{
              padding: 12,
              backgroundColor: "white"
            }}>
              Class: {Class_of_album}
            </Box>
          </Grid>

          <Grid item xs={2} />

          <Grid item xs={4} style={{
            float: "right"
          }}>
            <img
              src={"/media" + Thumbnail}
              alt="thumbnail"
              style={{
                width: "100%",
                height: "auto"
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">
              Features of the object identified
            </Typography>
            <TableContainer component={Paper} style={{ ...styles }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Feature</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Weapons</TableCell>
                    <TableCell>{Weapons}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      }

    </Grid >
  </Protected>;
}
