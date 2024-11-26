import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { formatDate } from "../../utils/DateFormatter";
import styles from "./TimeBox.module.css";
import { useEffect, useState } from "react";

function TimeBox() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let timeRefresher = setTimeout(() => {
      setTime(new Date());
    }, 1000);

    return () => clearTimeout(timeRefresher);
  }, [time]);

  return (
    <div className={styles["timebox"]}>
      <CalendarMonthIcon />
      <span>{formatDate(time)}</span>
    </div>
  );
}

export default TimeBox;
