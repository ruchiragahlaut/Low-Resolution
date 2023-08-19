import { Grid, Box, Paper, Button, Alert } from "@mui/material";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { DetectContext } from "../base/context";

const styles = {
  padding: 16,
};
const allowedFileTypes = [".jpg", ".jpeg", ".png", ".tiff"];

export default function BatchPage() {
  const navigate = useNavigate();

  const { setImage, setFile, setSize } = useContext(DetectContext);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState(
    "Please upload an image containing an object for a model to train properly."
  );
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileName = file.name;
      const fileExtension = fileName
        .substring(fileName.lastIndexOf("."), fileName.length)
        .toLowerCase();

      if (allowedFileTypes.includes(fileExtension)) {
        if (fileType.startsWith("image/")) {
          setError(false);
          setMessage(
            "Please upload an image containing an object for a model to train properly."
          );

          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64String = reader.result;

            setImage(base64String);
            setFile(file.name);
            setSize(file.size);

            setSelectedFileName(file.name);
            setSelectedFileSize(file.size);
          };
        } else {
          setError(true);
          setMessage("Uploaded file is not an image. Please upload an image.");
        }
      } else {
        setError(true);
        setMessage(
          "File type not supported. Please upload supported file types only."
        );
      }
    }
  };

  useEffect(() => {
    const fileInput = fileInputRef.current;
    fileInput.addEventListener("change", handleFileChange);
    return () => {
      fileInput.removeEventListener("change", handleFileChange);
    };
  });

  return (
    <>
      <Grid container gap={4} paddingY={2}>
        <Grid
          item xs={12}
          container component={Paper} style={styles}
          onDragOver={e => e.preventDefault()}
        >
          <Grid item xs={10}>
            Drag and drop images here
            <br />
            <br />
            {selectedFileName ? (
              <Box
                component={Paper}
                style={{ ...styles, width: "max-content" }}
              >
                {selectedFileName} -{" "}
                {selectedFileSize > 1024 * 1024
                  ? `${(selectedFileSize / 1024 / 1024).toFixed(2)} MiB`
                  : selectedFileSize > 1024
                    ? `${(selectedFileSize / 1024).toFixed(2)} KiB`
                    : `${selectedFileSize} Bytes`}
              </Box>
            ) : (
              <Box
                component={Paper}
                style={{ ...styles, width: "max-content" }}
              >
                Allowed file types: {allowedFileTypes.join(", ")}
              </Box>
            )}
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" component="label">
              <input type="file" ref={fileInputRef} accept="image/*" hidden />
              Browse Images
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Alert severity={error ? "error" : "info"}>{message}</Alert>
        </Grid>

        <Grid>
          <Box component={Paper} style={{ ...styles, width: "max-content" }}>
            Add New Object
          </Box>
        </Grid>

        <Grid>
          <Box component={Paper} style={{ ...styles, width: "max-content" }}>
            Details Added Successfully!
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
