import { Grid, Paper, Button, } from "@mui/material";
// import axios from "axios";

import Protected from "../layout/protected";

const styles = {
  padding: 12
}

export default function RetrainPage() {
  return <Protected>
    <Grid container component={Paper} marginY={2} style={styles}>
      Retrain the model for the new images in the database.
    </Grid>
    <Grid component={Paper}>
      <Button
        variant="contained"
        color="secondary"
      >
        Retrain Model
      </Button>
    </Grid>
  </Protected>
}
