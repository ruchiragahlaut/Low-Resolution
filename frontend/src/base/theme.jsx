import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const defaultTheme = createTheme({
  palette: {
    background: {
      paper: "#FAFAFABB",
    },
    error: {
      main: "#e57373EE",
    },
    warning: {
      main: "#ffb74dEE",
    },
    info: {
      main: "#4fc3f7EE",
    },
    success: {
      main: "#81c784EE",
    },
  },
  shape: {
    borderRadius: 12,
  }
});

export default function Theme({ children }) {
  return <>
    < CssBaseline />
    <ThemeProvider theme={defaultTheme}>
      {children}
    </ThemeProvider>
  </>;
}
