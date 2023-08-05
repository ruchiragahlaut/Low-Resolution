import { Grid, Box, Paper, Button, Alert } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { DetectContext } from "../base/context";

const styles = {
  padding: 16
}

export default function DetectPage() {
  const navigate = useNavigate();
  const { image, file, size } = useContext(DetectContext);

  return <>
    
  </>;
}
