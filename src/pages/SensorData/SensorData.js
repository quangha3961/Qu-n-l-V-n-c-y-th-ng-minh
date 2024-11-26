import { Box, Pagination, Slider, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import DatePicker from "../../components/DatePicker/DatePicker";
import pagination from "../../components/Pagination/Pagination.module.css";
import styles from "../../components/Table/Table.module.css";
import { formatDate } from "../../utils/DateFormatter";
import { buildQueryString } from "../../utils/request-utils";

function SensorDataPage() {
  const [sensorDataHistory, setSensorDataHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState({
    dateRange: { from: null, to: null },
    tempRange: { from: 0, to: 100 },
    hudRange: { from: 0, to: 100 },
    lightRange: { from: 0, to: 1024 },
  });

  const handleChange = (_, value) => {
    setPage(value);
  };
  const handleTempRangeChange = (_, newVal) => {
    setFilter({ ...filter, tempRange: { from: newVal[0], to: newVal[1] } });
  };
  const handleHudRangeChange = (_, newVal) => {
    setFilter({ ...filter, hudRange: { from: newVal[0], to: newVal[1] } });
  };
  const handleLightRangeChange = (_, newVal) => {
    setFilter({ ...filter, hudRange: { from: newVal[0], to: newVal[1] } });
  };
  const fetchHistory = async () => {
    let resp = await fetch(
      `http://localhost:5000/api/sensor/history?` +
        buildQueryString({
          page: page - 1,
          from: filter.dateRange.from,
          to: filter.dateRange.to,
          minTemp: filter.tempRange.from,
          maxTemp: filter.tempRange.to,
          minHud: filter.hudRange.from,
          maxHud: filter.hudRange.to,
          minLight: filter.lightRange.from,
          maxLight: filter.lightRange.to,
        })
    ).then((res) => res.json());
    console.log(resp.data);
    setSensorDataHistory(resp.data);
    setTotalPage(resp.totalPage);
  };

  useEffect(() => {
    fetchHistory();
  }, [page, totalPage]);

  return (
    <>
      <div className={styles["header"]}>
      </div>
      <Table>
        <TableHead className={styles["table__head"]}>
          <TableRow>
            <TableCell>Temperature</TableCell>
            <TableCell>Humidity</TableCell>
            <TableCell>Lighting</TableCell>
            <TableCell>Raining</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={styles["table__body"]}>
          {sensorDataHistory.map((history) => (
            <TableRow key={history.timestamp}>
              <TableCell>{history.temperature}°C</TableCell>
              <TableCell>{history.humidity}%</TableCell>
              <TableCell>{history.lighting} %</TableCell>
              <TableCell>{history.raining}%</TableCell>
              <TableCell>{formatDate(new Date(history.timestamp))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={pagination["pagination"]}>
        <Pagination count={totalPage} page={page} onChange={handleChange} />
      </div>
    </>
  );
}

export default SensorDataPage;
