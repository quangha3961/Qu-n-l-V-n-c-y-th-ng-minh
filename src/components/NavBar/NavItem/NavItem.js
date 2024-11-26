import { NavLink } from "react-router-dom";
import styles from "./NavItem.module.css";

function NavItem({ label, path, icon }) {
  return (
    <NavLink to={path} className={({ isActive }) => (isActive ? styles["active"] : undefined)}>
      <li className={styles["nav-item"]}>
        <div className={styles["icon"]}>{icon}</div>
        <span className={styles["label"]}>{label}</span>
      </li>
    </NavLink>
  );
}

export default NavItem;
