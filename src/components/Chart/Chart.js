import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Card from "../Ui/Card";
import styles from "./Chart.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: {
    temperature: {
      type: "linear",
      display: true,
      ticks: {
        display: true,
      },
      suggestedMin: 25,
      suggestedMax: 40,
    },
    humidity: {
      type: "linear",
      display: false,
      suggestedMin: 25,
      suggestedMax: 40,
    },
    lighting: {
      type: "linear",
      display: false,
      suggestedMin: 25,
      suggestedMax: 40,
    },
    raining: {
      type: "linear",
      display: false,
      suggestedMin: 25,
      suggestedMax: 40,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

function Chart({ labels, data }) {
  const datasets = [
    {
      label: "Temperature",
      data: data.map((record) => record.temperature),
      borderColor: "rgb(255, 0, 0)",  // Đỏ
      backgroundColor: "rgba(255, 0, 0, 0.2)", // Màu nền đỏ
      yAxisID: "temperature",
    },
    {
      label: "Humidity",
      data: data.map((record) => record.humidity),
      borderColor: "rgb(0, 255, 0)",  // Xanh lá
      backgroundColor: "rgba(0, 255, 0, 0.2)", // Màu nền xanh lá
      yAxisID: "humidity",
    },
    {
      label: "Lighting",
      data: data.map((record) => record.lighting),
      borderColor: "rgb(0, 0, 255)",  // Xanh dương
      backgroundColor: "rgba(0, 0, 255, 0.2)", // Màu nền xanh dương
      yAxisID: "lighting",
    },
    {
      label: "Raining",
      data: data.map((record) => record.raining),
      borderColor: "rgb(0, 0, 0)",  // Đen
      backgroundColor: "rgba(0, 0, 0, 0.2)", // Màu nền đen
      yAxisID: "raining",
    },
  ];

  return (
    <Card className={styles["chart"]}>
      <Line options={options} data={{ labels, datasets }} />
    </Card>
  );
}

export default Chart;
