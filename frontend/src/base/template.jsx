import { Grid, Box } from "@mui/material";
import { useContext } from "react";

import ThemeProvider from "./theme";
import RouterProvider from "./router";
import ContextProvider from "./context";

import Header from "../layout/header";
import Sidebar from "../layout/sidebar";

import { AuthContext } from "../base/context";

import bgimage from "../background.jpg"

export default function BaseTemplate({ children }) {
  const { token } = useContext(AuthContext);

  return <>
    <ThemeProvider>
      <ContextProvider>
        <RouterProvider>
          <Box>
            <img src={bgimage} alt="Background" style={{ width: "100%", height: "100%", position: "absolute", zIndex: "-1" }} />
          </Box>
          <Grid container>
            <Grid item xs={2}>
              <Sidebar />
            </Grid>
            <Grid item xs={10}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100vh',
                  padding: 3,
                }}
              >
                <Header />
                {children}
              </Box>
            </Grid>
          </Grid>
        </RouterProvider>
      </ContextProvider>
    </ThemeProvider>
  </>
}
