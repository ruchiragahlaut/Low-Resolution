import { Grid, Box, Paper, Button, Alert } from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../base/contexts/auth";
import { DetectContext } from "../base/contexts/detect";
import endpoints from "../base/endpoints.json";
import Protected from "../layout/protected";

const styles = {
  padding: 16
}
const allowedFileTypes = [".jpg", ".jpeg", ".png", ".tiff"];

export default function IndexPage() {
  const navigate = useNavigate();
  const { CSRFtoken } = useContext(AuthContext);
  const {
    setImageBin, setFilename, setBytessize,
    setPredictions
  } = useContext(DetectContext);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("Please upload an image of an object for classification.");

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
          reader.readAsArrayBuffer(file);
          reader.onload = () => {
            const buffer = reader.result;

            // Set image data
            const ImageBin = new File([new Uint8Array(buffer)], fileName, { type: fileType });
            setImageBin(ImageBin);
            setFilename(file.name);
            setBytessize(file.size);

            // Make API call to ML endpoint
            const URL = endpoints.baseurl + endpoints.ml.detect;
            const data = new FormData();
            data.append("image", ImageBin);
            data.append("csrfmiddlewaretoken", CSRFtoken);
            const config = {
              withCredentials: true,
              headers: {
                "X-CSRFToken": CSRFtoken,
              }
            };

            setError(false);
            setMessage("Analysing image ...");

            axios.post(URL, data, config).then(res => {
              setPredictions(res.data);

              navigate("/detect");
            }).catch(err => {
              setError(true);
              setMessage(`${err.response?.data ?? err.message}`);
            });

            // navigate("/detect");
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

  return <Protected>
    <Grid container gap={4} paddingY={2}>
      <Grid
        item xs={12}
        container component={Paper} style={styles}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileChange}
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
              onChange={handleFileChange}
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
  </Protected>;
}
