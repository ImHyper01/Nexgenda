import React from "react";
import styles from './style.module.scss';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.topBar}>
          <img src="/logo.png" alt="Vision Flow Logo" className={styles.logo} />
          <button className={styles.iconButton}>⚙️</button>
        </div>
        <button className={styles.menuButton}>Agenda</button>
        <button className={styles.menuButton}>to-do-list</button>
      </div>

      <div className={styles.notificationBox}>
        <p className={styles.notificationTitle}>Real time melding</p>
        <div className={styles.messageBox}>Je hebt 1 nieuwe mail</div>
        <button className={styles.addButton}>Add</button>
      </div>

      <div className={styles.aiHelp}>
        <button className={styles.helpButton}>🤖 Help AI met je planning!</button>
      </div>
    </div>
  );
}