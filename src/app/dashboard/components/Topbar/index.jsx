import React from "react";
import styles from './style.module.scss';

export default function Topbar() {
    return (
      <div className={styles.topbar}>
        <button className={styles.viewButton}>Dag</button>
        <button className={`${styles.viewButton} ${styles.active}`}>Week</button>
        <button className={styles.viewButton}>Maand</button>
      </div>
    );
  }