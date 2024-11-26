import { useEffect, useState } from "react";
import styles from "./HistoryTimeline.module.css";
import TimelineItem from "./TimelineItem/TimelineItem";

function HistoryTimeline() {
  const [actionHistory, setActionHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      let history = await await fetch("http://localhost:5000/api/actions/history").then((res) => res.json());
      setActionHistory(history.data);
    }
    fetchHistory();
  }, []);

  return (
    <ul className={styles["history-timeline"]}>
      {actionHistory.map((history) => (
        <TimelineItem
          key={history.timestamp}
          timestamp={new Date(history.timestamp)}
          content={history.actionType + " " + history.deviceId}
        />
      ))}
    </ul>
  );
}

export default HistoryTimeline;
