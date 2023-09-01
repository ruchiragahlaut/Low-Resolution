import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

import headerConfig from "./config.json";

import logo from "../../logo.png";

const titles = Object.fromEntries(
  headerConfig.map(({ pageURL, headerText }) => [pageURL, headerText])
);

// Styles
const headerStyles = {
  textAlign: "center",
  flexGrow: 1
};

const logoStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

export default function Header() {
  const currentURL = useLocation().pathname;

  return <div>
    {currentURL === "/login" && <div sx={logoStyles}>
      <img src={logo} alt="Logo" style={{ width: 180, height: "auto", aspectRatio: 1 }} />
    </div>}
    <Typography variant="h4" component="div" sx={headerStyles}>
      {titles[currentURL] ?? "Low Resolution Image Classification"}
    </Typography>
  </div>
}
