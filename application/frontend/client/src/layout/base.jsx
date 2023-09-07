import { Grid, Box, Paper, Alert } from "@mui/material";

import { useContext } from "react";
import { AuthContext } from "../base/contexts/auth";
import { NotificationContext } from "../base/contexts/notification";

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
  height: "100vh",
  padding: 2,
  overflow: 'auto',
  flexGrow: 1,
};

export default function BaseTemplateLayout({ children }) {
  const { Status } = useContext(AuthContext);
  const { Message, Type } = useContext(NotificationContext);

  return <Box>
    <div>
      <img src={bgimage} alt="Background" style={bgimageStyles} />
    </div>
    <Grid container sx={{ justifyContent: 'center', alignContent: 'center', height: '100vh', overflow: 'auto' }} >
      {Status && <Grid item xs={2} component={Sidebar} />}

      {/* 9.9 grid columns because layout breaks at 10 */}
      {/* 10 cols ~= 83.33333% */}
      <Grid item
        component={Status ? "main" : Paper}
        sx={{
          ...mainGridStyles,
          ...(Status ? {
            maxWidth: "82%" // Sidebar 2 / 12 cols ~ 20%
          } : {
            justifyContent: 'center',
            height: 'min-content',
            flexGrow: "unset"
          })
        }}
      >
        <Header />
        {Message !== "" && <Box component={Paper} sx={{
          width: "100%",
        }}>
          <Alert severity={Type} sx={{ m: 2 }}>{Message}</Alert>
        </Box>}
        {children}
      </Grid>
    </Grid>
  </Box >
}
