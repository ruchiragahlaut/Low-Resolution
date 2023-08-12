import { Grid, Box, Paper, Button, Alert } from "@mui/material";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { DetectContext } from "../base/context";

const styles = {
  padding: 16
}
const allowedFileTypes = [".jpg", ".jpeg", ".png", ".tiff"];

export default function IndexPage() {
  const navigate = useNavigate();

  const { setImage, setFile, setSize } = useContext(DetectContext);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("Please upload an image of an object for classification.");

  const fileInputRef = useRef(null);
  const dragAndDropRef = useRef(null);

  const handleFileChange = (e) => {
    e.preventDefault();

    // Drag and drop or input type file
    const file = (e.dataTransfer ?? e.target)?.files[0];
    if (file) {
      const fileType = file.type;
      const fileName = file.name;
      const fileExtension = fileName
        .substring(fileName.lastIndexOf("."), fileName.length)
        .toLowerCase();

      if (allowedFileTypes.includes(fileExtension)) {
        if (fileType.startsWith("image/")) {
          setError(false);
          setMessage("Please upload an image of an object for classification.");

          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64String = reader.result;

            setImage(base64String);
            setFile(file.name);
            setSize(file.size);

            navigate("/detect");
          }

        } else {
          setError(true);
          setMessage("Uploaded file is not an image. Please upload an image.");
        }
      } else {
        setError(true);
        setMessage("File type not supported. Please upload supported file types only.");
      }
    }
  }

  useEffect(() => {
    const fileInput = fileInputRef?.current;
    const dragAndDrop = dragAndDropRef?.current;
    fileInput.addEventListener("change", handleFileChange);
    dragAndDrop.addEventListener("drop", handleFileChange);
    return () => {
      fileInput.removeEventListener("change", handleFileChange);
      dragAndDrop.removeEventListener("drop", handleFileChange);
    }
  });

  return <>
    <Grid container gap={4} paddingY={2}>
      <Grid
        item xs={12}
        container component={Paper} style={styles}
        ref={dragAndDropRef}
        onDragOver={e => e.preventDefault()}
      >
        <Grid item xs={10}>
          Drag and drop an image here
          <br />
          <br />
          <Box component={Paper} style={{ ...styles, width: "max-content" }}>
            Allowed file types: {allowedFileTypes.join(", ")}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" component="label">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
            />
            Browse Image
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Alert severity={error ? "error" : "info"}>
          {message}
        </Alert>
      </Grid>
    </Grid>
  </>;
}
