import { useState } from "react";
import Card from "../Ui/Card";
import styles from "./DeviceState.module.css";
import useWebsocket from "../../hooks/useWebsocket";

function DeviceState({ deviceId, label, offIcon, onIcon }) {
  const [isOn, setIsOn] = useState(false);
  const client = useWebsocket("ws://localhost:8080/websocket");

  client.onConnect = () => {
    client.subscribe(`/topic/esp8266/${deviceId}/state`, (message) => {
      setIsOn(message.body === "on");
    });
  };

  return (
    <Card className={styles["device-state-cont"]}>
      <div className={styles["device__icon"]}>{isOn ? onIcon : offIcon}</div>
      <h2 className={styles["device__name"]}>{label}</h2>
    </Card>
  );
}

export default DeviceState;
