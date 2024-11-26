import styles from "./Card.module.css";

function Card({ children, style, className = "" }) {
  return (
    <div className={`${styles["card"]} ${className}`} style={style}>
      {children}
    </div>
  );
}

export default Card;
