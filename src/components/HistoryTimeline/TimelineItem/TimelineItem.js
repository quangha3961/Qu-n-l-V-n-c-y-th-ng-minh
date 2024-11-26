import { formatDate } from "../../../utils/DateFormatter";
import styles from "./TimelineItem.module.css";
import Card from "../../Ui/Card";

function TimelineItem({ timestamp, content }) {
  return (
    <li className={styles["timeline-item"]}>
      <div className={styles["timestamp"]}>{formatDate(timestamp)}</div>
      <div className={styles["separator"]}>
        <div className={styles["line"]}></div>
        
        <div className={styles["line"]}></div>
      </div>
      <div className={styles["content"]}>
        <Card className={styles["detail"]}>{content}</Card>
      </div>
    </li>
  );
}

export default TimelineItem;
