'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import Chatbot from '../Chatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

function ToDoListPopup({ onClose }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState('');
  const router = useRouter();

  const addItem = () => {
    if (!text.trim() || !deadline) return;
    setItems(prev => [...prev, { text: text.trim(), deadline }]);
    setText('');
    setDeadline('');
  };

  const removeItem = index => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  
  const addToAgenda = (item) => {
    const params = new URLSearchParams({
      title: item.text,
      date:  item.deadline       // bv. "2025-05-26T12:00"
    });
    router.push(`/dashboard?${params.toString()}`);
    onClose();
  };



  return (
    <div className={styles.todoContent}>
      <button className={styles.closeButton} onClick={onClose}>×</button>
      <h2>To-Do List</h2>

      <div className={styles.todoInput}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nieuwe taak"
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          className={styles.dateInput}
        />
        <button onClick={addItem}>Toevoegen</button>
      </div>

      <ul className={styles.todoList}>
        {items.map((item, idx) => (
          <li key={idx}>
            <div>
              <strong>{item.text}</strong><br />
              <small>Deadline: {new Date(item.deadline).toLocaleString()}</small>
            </div>
            <div className={styles.itemButtons}>
              <button onClick={() => addToAgenda(item)}>🗓️ Op agenda</button>
              <button onClick={() => removeItem(idx)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Sidebar() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const router = useRouter();

  const toggleChat = () => setIsChatOpen(prev => !prev);
  const toggleTodo = () => setIsTodoOpen(prev => !prev);

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

          {/* Open To-Do Popup in plaats van navigeren */}
          <button
            type="button"
            onClick={toggleTodo}
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

      {/* Overlay achter de To-Do */}
      <div
        className={`${styles.overlay} ${isTodoOpen ? styles.open : ''}`}
        onClick={toggleTodo}
      />

      {/* To-Do paneel */}
      <div className={`${styles.todoWrapper} ${isTodoOpen ? styles.open : ''}`}>
        <ToDoListPopup onClose={toggleTodo} />
      </div>
    </>
  );
}
