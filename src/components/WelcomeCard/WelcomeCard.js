import TimeBox from "../TimeBox/TimeBox";
import Card from "../Ui/Card";
import styles from "./WelcomeCard.module.css";

function WelcomeCard() {
  return (
    <Card className={styles["welcome"]}>
      <TimeBox />
      <div className={styles["greeting"]}>
        <h2 className={styles["heading"]}>Welcome to IOT Dashboard</h2>
        <p className={styles["desc"]}>Have great experience, Dung!</p>
      </div>
    </Card>
  );
}

export default WelcomeCard;
