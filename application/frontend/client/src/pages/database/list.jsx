import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Paper,
  Button,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from "@mui/material";
import axios from "axios";

import { NotificationContext } from "../../base/contexts/notification";

import endpoints from "../../base/endpoints.json";
import Protected from "../../layout/protected";

const styles = {
  padding: 16,
};

export default function DatabaseListPage() {
  const navigate = useNavigate();
  const [TableData, setTableData] = useState([]);
  const { setType, setMessage } = useContext(NotificationContext);

  useEffect(() => {
    const URL = endpoints.baseurl + endpoints.database;
    axios.get(URL, { withCredentials: true }).then((res) => {
      const data = [];
      res.data.forEach((album, index) => {
        data.push({
          id: index + 1,
          primary_key: album.id,
          name: album.title,
          country: album.country,
          "class": album.class_of_album,
          images: album.images.length,
        });
      });
      setTableData(data);
    }).catch((err) => {
      setType("error");
      setMessage(`Unable to fetch data. ${err.response?.data ?? err.message}`);
    });
  }, [setType, setMessage]);

  return <Protected>
    <Grid container gap={4} paddingY={2}>

      {/* Table section */}
      <Grid item xs={12}>
        <TableContainer component={Paper} style={{ ...styles }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S No.</TableCell>
                <TableCell>Name of Object</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Class of Object</TableCell>
                <TableCell>No. of Images</TableCell>
                <TableCell>View Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.class}</TableCell>
                  <TableCell>{row.images}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={e => navigate("/database/view/" + row.primary_key)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
    <Grid component={Paper}>
      <Button
        variant="contained"
        onClick={e => navigate("/database/add")}
        color="secondary"
      >
        Add New Object
      </Button>
    </Grid>
  </Protected>
}
