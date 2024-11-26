import styles from "./Field.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Field({ label, currentValue }) {
  return (
    <div className={styles["field"]}>
      <div className={styles["main"]}>
        <div className={styles["label"]}>{label}</div>
        <div className={styles["value"]}>{currentValue}</div>
        <ArrowForwardIosIcon className={styles["go-forward"]} />
      </div>
      <div className={styles["divider"]}></div>
    </div>
  );
}

export default Field;
