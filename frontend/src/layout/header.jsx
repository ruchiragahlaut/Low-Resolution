import { Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const headerTitles = {
  "": "Low Resolution Image Classification",
  "/detect": "Low Resolution Image Classification",
  "/batch": "Batch Classification",
  "/train": "Retrain Model",
  "/database": "Database"
}

export default function Header() {
  const path = useLocation().pathname;

  return <>
    <Toolbar>
      <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        {
          path in headerTitles ?
            headerTitles[path] :
            "Low Resolution Image Classification"
        }
      </Typography>
    </Toolbar>
  </>;
}
