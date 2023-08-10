import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const defaultTheme = createTheme({
  palette: {
    secondary: {
      main: "#33AA5599",
    },
    background: {
      paper: "#FAFAFA99",
      // paper: "#AFAFAF66",
    },
    error: {
      main: "#FF0000EE",
    },
    warning: {
      main: "#FFFF00EE",
    },
    info: {
      main: "#0000FFEE",
    },
    success: {
      main: "#00FF00EE",
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
