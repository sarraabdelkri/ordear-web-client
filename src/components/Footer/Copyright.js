import React from "react";
import styles from "./Footer.module.css";
function Copyright() {
  return (
    <div className="d-block justify-content-center align-items-center">
      <div className={styles.copyright}>
        © {new Date().getFullYear()} IPACT Consult  Alright Reserved
        <div className="pt-2"></div>

      </div>

    </div>
  );
}

export default Copyright;