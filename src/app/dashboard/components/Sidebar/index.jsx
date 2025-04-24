'use client';
import React, { useState } from "react";
import styles from './style.module.scss';
import Chatbot from '../Chatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.topBar}>
          <button className={styles.iconButton}>
            <FontAwesomeIcon icon={faGear} />
          </button>
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
        <button className={styles.helpButton} onClick={toggleChat}>
          🤖 Help AI met je planning!
        </button>
        {isChatOpen && (
          <div className={styles.chatWrapper}>
            <Chatbot />
          </div>
        )}
      </div>
    </div>
  );
}