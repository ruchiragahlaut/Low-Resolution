import { Box, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../logo.png"

const sidebarItems = {
  "detect": {
    text: "Detect",
    url: "/detect"
  },
  "batch": {
    text: "Batch Classification",
    url: "/batch"
  },
  "train": {
    text: "Train",
    url: "/train"
  },
  "database": {
    text: "Database",
    url: "/database"
  }
}

export default function Sidebar() {
  const path = useLocation().pathname;
  const navigate = useNavigate();

  return <>
    <Box
      component={Paper}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 2,
        padding: 2,
        height: '100vh',
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2
      }}>
        <img src={logo} alt="Logo" style={{ width: 180, height: "auto", aspectRatio: 1 }} />
      </div>

      {Object.keys(sidebarItems).map((key) => {
        return <Button
          key={key}
          color={path === sidebarItems[key].url ? "secondary" : "primary"}
          variant="contained"
          onClick={() => navigate(sidebarItems[key].url)}
        >
          {sidebarItems[key].text}
        </Button>
      })}
    </Box >
  </>;
}
