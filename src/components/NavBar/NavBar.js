import NavItem from "./NavItem/NavItem";
import styles from "./NavBar.module.css";
import BarChartIcon from "@mui/icons-material/BarChart";
import WifiTetheringErrorIcon from "@mui/icons-material/WifiTetheringError";
import HistoryIcon from "@mui/icons-material/History";
import Card from "../Ui/Card";

function NavBar() {
  return (
    <Card className={styles["nav-bar"]}>
      <nav>
        <ul>
          
          <div className={styles["nav-main"]}>
            <NavItem label="Dashboard" path="dashboard"  />
            <NavItem label="Sensor Data" path="data"  />
            <NavItem label="History" path="history" />
          </div>
        </ul>
      </nav>
    </Card>
  );
}

export default NavBar;
