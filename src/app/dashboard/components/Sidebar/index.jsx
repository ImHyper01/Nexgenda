//src/app/dashboard/components/sidebar/index.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import Chatbot from '../Chatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

function ToDoListPopup({ onClose }) {
  const [items, setItems]       = useState([]);
  const [text, setText]         = useState('');
  const [date, setDate]         = useState('');
  const [time, setTime]         = useState('12:00');
  const [duration, setDuration] = useState('1');
  const [color, setColor]       = useState('red');
  const router                  = useRouter();

  // laad persistent todos
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setItems(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!text.trim() || !date || !time) return;
    const datetime = `${date}T${time}`;
    setItems(prev => [
      ...prev,
      { text: text.trim(), datetime, duration, color }
    ]);
    setText(''); setDate(''); setTime('12:00');
    setDuration('1'); setColor('red');
  };

  const removeItem = i =>
    setItems(prev => prev.filter((_, idx) => idx !== i));

  const addToAgenda = item => {
    const start = new Date(item.datetime);
    const end   = new Date(start);
    end.setHours(end.getHours() + parseFloat(item.duration));
    const params = new URLSearchParams({
      title: item.text,
      start: start.toISOString(),
      end:   end.toISOString(),
      color: item.color
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

        {/* native date picker */}
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        {/* native time picker */}
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        />

        {/* duur */}
        <select value={duration} onChange={e => setDuration(e.target.value)}>
          <option value="0.5">30 min</option>
          <option value="1">1 uur</option>
          <option value="2">2 uur</option>
          <option value="3">3 uur</option>
        </select>

        {/* kleur */}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="red">Rood</option>
          <option value="yellow">Geel</option>
          <option value="green">Groen</option>
          <option value="blue">Blauw</option>
        </select>

        <button onClick={addItem}>Toevoegen</button>
      </div>

      <ul className={styles.todoList}>
        {items.map((item, idx) => (
          <li key={idx}>
            <div>
              <strong>{item.text}</strong> ({item.duration}u, <span style={{color:item.color}}>{item.color}</span>)<br/>
              <small>Start: {new Date(item.datetime).toLocaleString()}</small>
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
  const [isChatOpen, setIsChatOpen]   = useState(false);
  const [isTodoOpen, setIsTodoOpen]   = useState(false);
  const [unreadMails, setUnreadMails] = useState(1);
  const router                        = useRouter();

  useEffect(() => {
    const iv = setInterval(() => {
      /* simulate real-time update */
      setUnreadMails(u => u);
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  const toggleChat = () => setIsChatOpen(o => !o);
  const toggleTodo = () => setIsTodoOpen(o => !o);

  return (
    <>
      <div className={styles.sidebar}>
        <div>
          <div className={styles.topBar}>
            <button className={styles.iconButton}>
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>

          <button
            className={styles.menuButton}
            onClick={() => router.push('/dashboard')}
          >
            Agenda
          </button>

          <button
            className={styles.menuButton}
            onClick={toggleTodo}
          >
            To-Do List
          </button>
        </div>

        <div className={styles.notificationBox}>
          <p className={styles.notificationTitle}>Real time melding</p>
          <div className={styles.messageBox}>
            Je hebt {unreadMails} nieuwe mail{unreadMails > 1 ? 's' : ''}
          </div>
          <button className={styles.addButton}>Add</button>
        </div>

        <div className={styles.aiHelp}>
          <button className={styles.helpButton} onClick={toggleChat}>
            🤖 Help AI met je planning!
          </button>
        </div>
      </div>

      {/* Chat overlay */}
      <div
        className={`${styles.overlay} ${isChatOpen ? styles.open : ''}`}
        onClick={toggleChat}
      />
      <div className={`${styles.chatWrapper} ${isChatOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={toggleChat}>×</button>
        <Chatbot />
      </div>

      {/* To-Do overlay */}
      <div
        className={`${styles.overlay} ${isTodoOpen ? styles.open : ''}`}
        onClick={toggleTodo}
      />
      <div className={`${styles.todoWrapper} ${isTodoOpen ? styles.open : ''}`}>
        <ToDoListPopup onClose={toggleTodo} />
      </div>
    </>
  );
}
