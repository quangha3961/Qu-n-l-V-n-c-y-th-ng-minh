import { useEffect, useState } from "react";
import { CiTempHigh } from "react-icons/ci";
import {
  PiFanFill,
  PiFanLight,
  PiLightbulbFilamentFill,
  PiLightbulbFilamentLight,
  PiWarningLight,
  PiWarningFill,
  PiTree,
} from "react-icons/pi";
import { GiPlantWatering } from "react-icons/gi";
import { SiSonarcloud } from "react-icons/si";
import { BsDroplet, BsSun } from "react-icons/bs";
import Chart from "../components/Chart/Chart";
import DeviceControl from "../components/DeviceControl/DeviceControl";
import StatCard from "../components/StatCard/StatCard";
import styles from "./Dashboard.module.css";
const MAX_CHART_POINT = 20;
const tempConfig = {
  low: 18,
  high: 30,
};
const humidConfig = {
  low: 70,
  high: 90,
};
const lightConfig = {
  low: 100,
  high: 1000,
};
const rainConfig = {
  low: 20,
  high: 80,
};

function DashboardPage() {
  const [sensorData, setSensorData] = useState({
    temperature: "-",
    humidity: "-",
    lighting: "-",
    raining: "-",
  });
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });

  useEffect(() => {
    const client = new WebSocket('ws://localhost:8080'); // Create WebSocket connection

    client.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    client.onmessage = (event) => {
      let receivedData = JSON.parse(event.data); // Assuming data is in JSON format
      setSensorData(receivedData);
      console.log("Received data:", receivedData); // Log received data

      // Update chart data
      let newChartData = { ...chartData };
      newChartData.labels.push(
        new Intl.DateTimeFormat("en", {
          timeStyle: "medium",
        }).format(new Date(receivedData.timestamp))
      );
      newChartData.data.push(receivedData);
      newChartData.labels = newChartData.labels.slice(-MAX_CHART_POINT);
      newChartData.data = newChartData.data.slice(-MAX_CHART_POINT);
      setChartData(newChartData);
      console.log("Updated chart data:", newChartData); // Log updated chart data
    };

    client.onclose = () => {
      console.log("WebSocket connection closed");
    };

    client.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (client.readyState === WebSocket.OPEN) {
        client.close(); // Close WebSocket connection when component unmounts
      }
    };
  }, [chartData]);

  useEffect(() => {
    async function fetchHistory() {
      console.log("Fetching sensor history...");
      let resp = await fetch("http://localhost:5000/api/sensor/history")
        .then((res) => res.json());

      console.log("Sensor history fetched:", resp);

      setChartData({
        labels: resp.data.map((h) =>
          new Intl.DateTimeFormat("en", {
            timeStyle: "medium",
          }).format(new Date(h.timestamp))
        ),
        data: resp.data.map((h) => ({
          temperature: h.temperature,
          humidity: h.humidity,
          lighting: h.lighting,
          raining: h.raining,
        })),
      });
      console.log("Chart data set:", chartData);
    }
    fetchHistory();
  }, []);

  return (
    <div id={styles["content"]}>
      <StatCard
        label="Temperature"
        config={tempConfig}
        icon={<CiTempHigh fontSize={46} />}
        value={sensorData.temperature}
        unit="degree"
      />
      <StatCard
        label="Humidity"
        config={humidConfig}
        icon={<BsDroplet fontSize={38} />}
        value={sensorData.humidity}
        unit="percent"
      />
      <StatCard
        label="Lighting"
        config={lightConfig}
        icon={<BsSun fontSize={38} />}
        value={sensorData.lighting}
        unit="lux"
      />
      <StatCard
        label="Rain"
        config={rainConfig}
        icon={<SiSonarcloud fontSize={38} />}
        value={sensorData.raining}
        unit="percent"
      />
      <Chart labels={chartData.labels} data={chartData.data} />
      <DeviceControl
        label="Heating"
        deviceId="heating"
        offIcon={<PiLightbulbFilamentLight />}
        onIcon={<PiLightbulbFilamentFill className={styles["bulb-on"]} />}
      />
      <DeviceControl
        label="Covering"
        deviceId="covering"
        offIcon={<PiFanLight className={styles["fan-off"]} />}
        onIcon={<PiFanFill className={styles["fan-on"]} />}
      />
      <DeviceControl
        label="Watering"
        deviceId="watering"
        offIcon={<PiTree className={styles["fan-off"]} />} 
        onIcon={<GiPlantWatering className={styles["water-on"]} />}
      />
    </div>
  );
}










export default DashboardPage;
