import { Grid, Box, Paper } from "@mui/material";

import { useContext } from "react";
import { AuthContext } from "../base/contexts/auth";

import Header from "./header/header";
import Sidebar from "./sidebar/sidebar";

import bgimage from "../background.jpg"

// Styles
const bgimageStyles = {
  width: "100%",
  height: "100%",
  position: "absolute",
  zIndex: "-1"
};

const mainGridStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: "max-content",
  padding: 2,
};

export default function BaseTemplateLayout({ children }) {
  const { Status } = useContext(AuthContext);

  return <Box>
    <div>
      <img src={bgimage} alt="Background" style={bgimageStyles} />
    </div>
    <Grid container sx={{ justifyContent: 'center', alignContent: 'center', height: '100vh' }} >
      {Status && <Grid item xs={2} component={Sidebar} />}

      {/* 9.9 grid columns because layout breaks at 10 */}
      <Grid item xs={Status ? 9.9 : "auto"}
        component={Status ? "main" : Paper}
        sx={{
          ...mainGridStyles,
          ...(Status ? {} : { justifyContent: 'center' })
        }}>
        <Header />
        {children}
      </Grid>
    </Grid>
  </Box >
}
