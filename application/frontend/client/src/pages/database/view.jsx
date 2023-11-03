import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid, Box, Paper,
  TextField, Button,
  Dialog
} from "@mui/material";
import axios from "axios";

import { AuthContext } from "../../base/contexts/auth";
import { NotificationContext } from "../../base/contexts/notification";
import endpoints from "../../base/endpoints.json";
import Protected from "../../layout/protected";

const allowedFileTypes = [".jpg", ".jpeg", ".png", ".tiff", ".tif"];

const imageStyles = {
  width: "100%",
  aspectRatio: 1,
};

export default function DatabaseViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { CSRFtoken } = useContext(AuthContext);
  const { setType, setMessage } = useContext(NotificationContext);

  const [Title, setTitle] = useState("");
  const [Country, setCountry] = useState("");
  const [Class_of_album, setClass_of_album] = useState("");
  const [Weapons, setWeapons] = useState("");
  const [ImageList, setImageList] = useState([]);

  const [UploadStatus, setUploadStatus] = useState("Drag and drop images here");

  const [dialogState, setDialogState] = useState(false);
  const [dialogHandler, setDialogHandler] = useState(null);
  const [dialogObject, setDialogObject] = useState("");

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
      setType("error");
      setMessage(`Unable to fetch data. ${err.response?.data ?? err.message}`);
    });
  }, [id, setType, setMessage]);

  async function sleep(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleFileChange = async (e) => {
    e.preventDefault();

    // Drag and drop or input type file
    const files = (e.dataTransfer ?? e.target)?.files;
    const completed = [];
    const failed = [];
    const total = files.length;

    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken,
      }
    };
    const URL = endpoints.baseurl + endpoints.images + "create/";

    for (const file of files) {
      await sleep(100);
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
              const payload = new FormData();
              const blob = new Blob([new Uint8Array(binaryImage)], { type: fileType });
              payload.append("image", blob, fileName);
              payload.append("album", id);
              payload.append("csrfmiddlewaretoken", CSRFtoken);
              try {
                const res = await axios.post(URL, payload, config);
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
                failed.push(file);
                setUploadStatus(`Uploading ${completed.length} of ${total} images / ${failed.length} failed...`);
                // setType("error");
                // setMessage(`Unable to upload ${fileName}. ${err.response?.data ?? err.message}`);
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

      // Add delay to prevent server overload
      await new Promise(resolve => setTimeout(resolve, 100));
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
      setType("info");
      setMessage("Updated successfully");
      // navigate("/database/view/" + res.data.id);
    }).catch(err => {
      setType("error");
      setMessage(`Unable to update. ${err.response?.data ?? err.message}`);
    });
  };

  function handleDelete() {
    const URL = endpoints.baseurl + endpoints.database + id + "/delete/";
    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken,
      }
    };
    axios.delete(URL, config).then(res => {
      setType("warning");
      setMessage("Deleted successfully");
      navigate("/database/");
    }).catch(err => {
      setType("error");
      setMessage(`Unable to delete. ${err.response?.data ?? err.message}`);
    });
  }

  function handleImageDelete(id) {
    const URL = endpoints.baseurl + endpoints.images + id + "/delete/";
    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": CSRFtoken,
      }
    };
    axios.delete(URL, config).then(res => {
      setType("warning");
      setMessage("Image deleted successfully");
      setImageList(ImageList.filter(image => image.primary_key !== id));
    }).catch(err => {
      setType("error");
      setMessage(`Unable to delete image. ${err.response?.data ?? err.message}`);
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
            <Button variant="contained" color="error" onClick={(e) => {
              e.preventDefault();
              setDialogObject(`object "${Title}"`);
              setDialogHandler("handleDelete");
              setDialogState(true);
            }}>
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
              onClick={(e) => {
                e.preventDefault();
                setDialogObject("selected image");
                setDialogHandler(image.primary_key);
                setDialogState(true);
              }}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              X
            </Button>
          </Grid>
        })
      }
    </Grid>

    {/* Delete confirmation dialog */}
    <Dialog
      open={dialogState}
      onClose={() => { }}
    >
      <Box component={Paper} padding={2}>
        <h3>Are you sure you want to delete {dialogObject}?</h3>
        <Button variant="contained" color="info" onClick={() => setDialogState(false)}>
          Cancel
        </Button>
        <Button
          variant="contained" color="error"
          onClick={() => {
            setDialogState(false);
            if (dialogHandler === "handleDelete") {
              handleDelete();
            } else {
              handleImageDelete(dialogHandler);
            }
          }}
          style={{
            marginLeft: 8
          }}
        >
          Delete
        </Button>
      </Box>
    </Dialog>

  </Protected >
};
