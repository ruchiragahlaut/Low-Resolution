import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Box, Paper, TextField, Button } from "@mui/material";
import axios from "axios";

import { AuthContext } from "../../base/contexts/auth";
import endpoints from "../../base/endpoints.json";
import Protected from "../../layout/protected";

const allowedFileTypes = [".jpg", ".jpeg", ".png", ".tiff"];

const imageStyles = {
  width: "100%",
  aspectRatio: 1,
};

export default function DatabaseViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { CSRFtoken } = useContext(AuthContext);

  const [Title, setTitle] = useState("");
  const [Country, setCountry] = useState("");
  const [Class_of_album, setClass_of_album] = useState("");
  const [Weapons, setWeapons] = useState("");
  const [ImageList, setImageList] = useState([]);

  const [UploadStatus, setUploadStatus] = useState("Drag and drop images here");

  useEffect(() => {
    const URL = endpoints.baseurl + endpoints.database + id + "/";
    axios.get(URL, { withCredentials: true }).then(res => {
      setTitle(res.data.title);
      setCountry(res.data.country);
      setClass_of_album(res.data.class_of_album);
      setWeapons(res.data.weapons);
      setImageList(res.data.images.map(image => {
        return {
          url: image.image.replace("http://localhost:8000", endpoints.baseurl + "/media"),
          primary_key: image.id
        }
      }));
    }).catch(err => {
      console.log(err);
    });
  }, [id]);

  const handleFileChange = async (e) => {
    e.preventDefault();

    // Drag and drop or input type file
    const files = (e.dataTransfer ?? e.target)?.files;
    let completed = [];
    let failed = [];
    const total = files.length;

    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken,
      }
    };

    for (const file of files) {
      if (file) {
        const fileType = file.type;
        const fileName = file.name;
        const fileExtension = fileName
          .substring(fileName.lastIndexOf("."), fileName.length)
          .toLowerCase();

        if (allowedFileTypes.includes(fileExtension)) {
          if (fileType.startsWith("image/")) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
              const binaryImage = reader.result;
              const URL = endpoints.baseurl + endpoints.images + "create/";
              const data = new FormData();
              data.append("image", new Blob([new Uint8Array(binaryImage)], { type: fileType }), fileName);
              data.append("album", id);
              data.append("csrfmiddlewaretoken", CSRFtoken);
              try {
                const res = await axios.post(URL, data, config);
                completed.push(file);
                setUploadStatus(`Uploading ${completed.length} of ${total} images / ${failed.length} failed...`);
                setImageList(prev => [
                  {
                    primary_key: res.data.id,
                    url: res.data.image.replace("http://localhost:8000", endpoints.baseurl + "/media")
                  },
                  ...prev
                ]);
              } catch (err) {
                console.log(err);
                failed.push(file);
                setUploadStatus(`Uploading ${completed.length} of ${total} images / ${failed.length} failed...`);
              }
            }
          } else {
            failed.push(file);
            setUploadStatus(`Uploading ${completed.length} of ${total} images / ${failed.length} failed...`);
          }
        } else {
          failed.push(file);
          setUploadStatus(`Uploading ${completed.length} of ${total} images / ${failed.length} failed...`);
        }
      } else {
        failed.push(file);
        setUploadStatus(`Uploading ${completed.length} of ${total} images / ${failed.length} failed...`);
      }
    } // for (const file of files)
  }

  function handlePatch(e) {
    e.preventDefault();
    const URL = endpoints.baseurl + endpoints.database + id + "/patch/";
    const data = new FormData();
    data.append("title", Title);
    data.append("country", Country);
    data.append("class_of_album", Class_of_album);
    data.append("weapons", Weapons);
    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken,
      }
    };
    axios.patch(URL, data, config).then(res => {
      navigate("/database/view/" + res.data.id);
    }).catch(err => {
      console.log(err);
    });
  };

  function handleDelete(e) {
    e.preventDefault();
    const URL = endpoints.baseurl + endpoints.database + id + "/delete/";
    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken,
      }
    };
    axios.delete(URL, config).then(res => {
      navigate("/database/");
    }).catch(err => {
      console.log(err);
    });
  }

  function handleImageDelete(e, id) {
    e.preventDefault();
    const URL = endpoints.baseurl + endpoints.images + id + "/delete/";
    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken,
      }
    };
    axios.delete(URL, config).then(res => {
      setImageList(ImageList.filter(image => image.primary_key !== id));
    }).catch(err => {
      console.log(err);
    });
  }

  return <Protected>
    <Grid container marginY={2} paddingX={2}>
      <Grid component={Paper} item xs={8} padding={2}>
        <Grid
          container
          component="form"
          onSubmit={handlePatch}
        >
          <Grid item xs={12}>
            <TextField
              label="Name of Object" value={Title}
              variant="filled" color="info" margin="normal"
              required fullWidth
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Country" value={Country}
              variant="filled" color="info" margin="normal"
              required fullWidth
              onChange={(e) => setCountry(e.target.value)}
              type="text" // Explicitly set the type to "text"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Class of Object" value={Class_of_album}
              variant="filled" color="info" margin="normal"
              required fullWidth
              onChange={(e) => setClass_of_album(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Weapons" value={Weapons}
              variant="filled" color="info" margin="normal"
              fullWidth
              onChange={(e) => setWeapons(e.target.value)}
            />
          </Grid>

          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Button variant="contained" color="secondary" type="submit">
              Update details
            </Button>
          </Grid>

          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete object
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={4} paddingLeft={2}>
        <Box
          component={Paper}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 2
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileChange}
        >
          <Box style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            {UploadStatus}
            <br />
            <Box component={Paper} style={{ padding: 16, width: "max-content" }}>
              Allowed file types: {allowedFileTypes.join(", ")}
            </Box>
          </Box>
          <Button variant="contained" component="label" color="info">
            <input
              type="file"
              onChange={handleFileChange}
              multiple accept="image/*"
              hidden
            />
            Browse Images
          </Button>
        </Box>
      </Grid>

    </Grid>

    <Grid container marginY={2} paddingX={2}>
      {
        ImageList.map((image, index) => {
          return <Grid
            item component={Paper}
            xs={3} padding={2}
            key={index}
            style={{ position: "relative" }}
            justifyContent="center"
          >
            <img src={image.url} alt={Title} style={imageStyles} />
            <br />
            <Button
              variant="contained" color="error"
              onClick={e => handleImageDelete(e, image.primary_key)}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              X
            </Button>
          </Grid>
        })
      }
    </Grid>
  </Protected >
};
