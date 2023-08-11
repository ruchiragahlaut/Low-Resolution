import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#FAFAFABB"
    },
    secondary: {
      main: "#33AA5599"
    },
    background: {
      paper: "#D9D9D9BB"
    },
    error: {
      main: "#FF0000"
    },
    warning: {
      main: "#FFFF00"
    },
    info: {
      main: "#0000FF"
    },
    success: {
      main: "#00FF00"
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
