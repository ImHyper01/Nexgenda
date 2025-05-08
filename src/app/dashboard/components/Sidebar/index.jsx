'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import Chatbot from '../Chatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  const toggleChat = () => setIsChatOpen(prev => !prev);

  return (
    <>
      <div className={styles.sidebar}>
        <div>
          <div className={styles.topBar}>
            <button className={styles.iconButton}>
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>
          <button className={styles.menuButton}>Agenda</button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/todolist')}
            className={styles.menuButton}
          >
            To-Do List
          </button>
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
        </div>
      </div>

      {/* Overlay achter de chat */}
      <div
        className={`${styles.overlay} ${isChatOpen ? styles.open : ''}`}
        onClick={toggleChat}
      />

      {/* Chatpaneel */}
      <div className={`${styles.chatWrapper} ${isChatOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={toggleChat}>×</button>
        <Chatbot />
      </div>
    </>
  );
}