import { Switch } from "@mui/material";
import { useState, useEffect } from "react";
import Card from "../Ui/Card";
import styles from "./DeviceControl.module.css";

function DeviceControl({ deviceId, label, offIcon, onIcon }) {
  const [isOn, setIsOn] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Kết nối WebSocket
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const client = new WebSocket("ws://localhost:8080");

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Connected");
    };

    client.onmessage = (event) => {
      const message = JSON.parse(event.data); // Giả sử bạn gửi dữ liệu dưới dạng JSON
      // Kiểm tra xem message có chứa deviceId và trạng thái
      if (message.deviceId === deviceId) {
        setIsOn(message.state === "on");
      }
    };

    return () => {
      client.close();
    };
  }, [client, deviceId]);

  const handleSwitch = async (e) => {
    let state = e.target.checked ? "on" : "off";
    setIsOn(state === "on");
    

    // Gửi lệnh bật/tắt kèm deviceId qua WebSocket
    client.send(JSON.stringify({ deviceId, state }));  // Gửi thông tin trạng thái thiết bị
  };

  return (
    <Card className={styles["device-control-cont"]}>
      <div className={styles["device__icon"]}>{isOn ? onIcon : offIcon}</div>
      <h2 className={styles["device__name"]}>{label}</h2>
      <div className={styles["actions"]}>
        <Switch checked={isOn} onChange={handleSwitch} disabled={isDisabled} />
      </div>
    </Card>
  );
}

export default DeviceControl;
