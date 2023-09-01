import { Box, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import navbarConfig from "./config.json";

import logo from "../../logo.png";

// Styles
const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 2,
  padding: 2,
  height: '100vh',
}

const logoStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 2
}

export default function Sidebar() {
  const currentURL = useLocation().pathname;
  const navigate = useNavigate();

  return <Box component={Paper} sx={containerStyles}>
    <div sx={logoStyles}>
      <img src={logo} alt="Logo" style={{ width: 180, height: "auto", aspectRatio: 1 }} />
    </div>

    {navbarConfig.map((nav, key) => {
      const { pageURL, buttonText } = nav;
      return <Button
        key={key}
        color={currentURL === pageURL ? "secondary" : "primary"}
        variant="contained"
        onClick={() => navigate(pageURL)}
      >
        {buttonText}
      </Button>
    })}
  </Box >
}
