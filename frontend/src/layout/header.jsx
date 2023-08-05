import { Toolbar, Typography } from "@mui/material";

export default function Header() {
  return <>
    <Toolbar>
      <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        Low Resolution Image Classification
      </Typography>
    </Toolbar>
  </>;
}
