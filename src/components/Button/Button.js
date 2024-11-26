import styles from "./Button.module.css";

function Button(props) {
  const className = `${props.className} ${styles["btn"]}`;
  return (
    <button {...props} className={className} style={{ marginLeft: "1rem" }}>
      {props.children}
    </button>
  );
}

export default Button;
