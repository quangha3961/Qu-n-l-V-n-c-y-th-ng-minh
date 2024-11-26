import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import styles from "./SearchBox.module.css";

function SearchBox() {
  const [value, setValue] = useState("");

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles["search-box"]}>
      <input
        className={styles["search-input"]}
        type="text"
        placeholder="Search for action..."
        value={value}
        onChange={handleInput}
      />
      <RiSearchLine className={styles["search-icon"]} />
    </div>
  );
}

export default SearchBox;
