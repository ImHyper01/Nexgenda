import React from 'react';
import styles from './style.module.scss';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>VisionFlow</h2>
      <ul className={styles.navList}>
        <li className={styles.navItem}>Dashboard</li>
        <li className={styles.navItem}>Taken</li>
        <li className={styles.navItem}>Agenda</li>
        <li className={styles.navItem}>AI-Assist</li>
        <li className={styles.navItem}>Instellingen</li>
      </ul>
    </div>
  );
};

