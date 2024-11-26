import Card from "../Ui/Card";
import styles from "./StatCard.module.css";

function StatCard({ label, icon, value, unit, config }) {
  const stateClassName = value <= config.low ? "low" : value >= config.high ? "high" : "avg";

  // Kiểm tra nếu value là số thì gọi toFixed, nếu không giữ nguyên value
  const displayValue = typeof value === "number" && !isNaN(value) ? value.toFixed(1) : value;

  return (
    <Card className={`${styles["stat"]} ${styles[label?.toLowerCase()]} ${styles[stateClassName]}`}>
      <h2 className={styles["label"]}>{label}</h2>
      <div className={styles["icon"]}>{icon}</div>
      <div>
        <div className={styles["figure"]}>{displayValue}</div>
        <div className={styles["unit"]}>{unit}</div>
        {/* <div className={styles["judge"]}>-12% than average</div> */}
      </div>
    </Card>
  );
}

export default StatCard;
