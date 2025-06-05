'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import Chatbot from '../Chatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { set, get, del } from 'idb-keyval';

function ToDoListPopup({ onClose }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [duration, setDuration] = useState('1');
  const [color, setColor] = useState('red');
  const [files, setFiles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setItems(JSON.parse(saved));
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(items));
    } catch (e) {
      alert("Opslaglimiet overschreden.");
    }
  }, [items]);

  const handleFileChange = async (e) => {
    const filesInput = Array.from(e.target.files);
    const metaFiles = [];

    for (const file of filesInput) {
      const id = '_' + Math.random().toString(36).substr(2, 9);
      await set(id, file);
      metaFiles.push({ id, name: file.name, type: file.type });
    }

    setFiles(metaFiles);
  };

  const addItem = () => {
    if (!text.trim() || !date || !time) return;
    const datetime = `${date}T${time}`;
    setItems(prev => [
      ...prev,
      {
        text: text.trim(),
        datetime,
        duration,
        color,
        files
      }
    ]);
    setText('');
    setDate('');
    setTime('12:00');
    setDuration('1');
    setColor('red');
    setFiles([]);
  };

  const removeItem = i => {
    const item = items[i];
    if (item?.files?.length) item.files.forEach(f => del(f.id));
    setItems(prev => prev.filter((_, idx) => idx !== i));
  };

  const addToAgenda = item => {
    const start = new Date(item.datetime);
    const end = new Date(start);
    end.setHours(end.getHours() + parseFloat(item.duration));
    const params = new URLSearchParams({
      title: item.text,
      start: start.toISOString(),
      end: end.toISOString(),
      color: item.color,
      files: JSON.stringify(item.files ?? [])
    });
    router.push(`/dashboard?${params.toString()}`);
    onClose();
  };

  return (
    <div className={styles.todoContent}>
      <button className={styles.closeButton} onClick={onClose}>×</button>
      <h2>To-Do List</h2>

      <div className={styles.todoInput}>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Nieuwe taak" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <select value={duration} onChange={e => setDuration(e.target.value)}>
          <option value="0.5">30 min</option>
          <option value="1">1 uur</option>
          <option value="2">2 uur</option>
        </select>
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="red">Rood</option>
          <option value="yellow">Geel</option>
          <option value="green">Groen</option>
          <option value="blue">Blauw</option>
        </select>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={addItem}>Toevoegen</button>
      </div>

      <ul className={styles.todoList}>
        {items.map((item, idx) => (
          <li key={idx}>
            <div>
              <strong>{item.text}</strong> ({item.duration}u, <span style={{ color: item.color }}>{item.color}</span>)<br />
              <small>Start: {new Date(item.datetime).toLocaleString()}</small>
              {item.files?.length > 0 && (
                <div>
                  <strong>📎 Documenten:</strong>
                  <ul>
                    {item.files.map((file, i) => (
                      <li key={i}>
                        <button
                          onClick={async () => {
                            const blob = await get(file.id);
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = file.name;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          {file.name} ⬇️
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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

function AppointmentPopup({ appointment, onClose, onUpdate }) {
  const [form, setForm] = useState({ ...appointment });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate(form);
    onClose();
  };

  return (
    <>
      <div className={`${styles.overlay} ${styles.open}`} onClick={onClose} />
      <div className={`${styles.todoWrapper} ${styles.open}`}>
        <div className={styles.todoContent}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <h2>Afspraken bewerken</h2>
          <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} />
          <input type="date" value={form.start?.slice(0, 10)} onChange={e => {
            const newDate = e.target.value;
            const time = form.start?.slice(11, 16) ?? '12:00';
            handleChange('start', `${newDate}T${time}`);
          }} />
          <input type="time" value={form.start?.slice(11, 16)} onChange={e => {
            const date = form.start?.slice(0, 10);
            handleChange('start', `${date}T${e.target.value}`);
          }} />
          <select value={form.color} onChange={e => handleChange('color', e.target.value)}>
            <option value="red">Rood</option>
            <option value="yellow">Geel</option>
            <option value="green">Groen</option>
            <option value="blue">Blauw</option>
          </select>
          {form.files?.length > 0 && (
            <div>
              <strong>📎 Documenten:</strong>
              <ul>
                {form.files.map((file, i) => (
                  <li key={i}>
                    <button
                      onClick={async () => {
                        const blob = await get(file.id);
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = file.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      {file.name} ⬇️
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={handleSave}>Opslaan</button>
        </div>
      </div>
    </>
  );
}

export default function Sidebar({ activeAppointment, onCloseActive }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [unreadMails, setUnreadMails] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const iv = setInterval(() => setUnreadMails(u => u), 30000);
    return () => clearInterval(iv);
  }, []);

  const toggleChat = () => setIsChatOpen(o => !o);
  const toggleTodo = () => setIsTodoOpen(o => !o);

  const handleUpdateAppointment = (updated) => {
    const stored = localStorage.getItem('appointments');
    if (!stored) return;
    const all = JSON.parse(stored);
    const updatedList = all.map(a => a.id === updated.id ? updated : a);
    localStorage.setItem('appointments', JSON.stringify(updatedList));
    window.location.reload();
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div>
          <div className={styles.topBar}>
            <button className={styles.iconButton}>
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>

          <button className={styles.menuButton} onClick={() => router.push('/dashboard')}>
            Agenda
          </button>

          <button className={styles.menuButton} onClick={toggleTodo}>
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

      {/* Chat popup */}
      <div className={`${styles.overlay} ${isChatOpen ? styles.open : ''}`} onClick={toggleChat} />
      <div className={`${styles.chatWrapper} ${isChatOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={toggleChat}>×</button>
        <Chatbot />
      </div>

      {/* To-Do popup */}
      <div className={`${styles.overlay} ${isTodoOpen ? styles.open : ''}`} onClick={toggleTodo} />
      <div className={`${styles.todoWrapper} ${isTodoOpen ? styles.open : ''}`}>
        <ToDoListPopup onClose={toggleTodo} />
      </div>

      {/* Appointment popup */}
      {activeAppointment && (
        <AppointmentPopup
          appointment={activeAppointment}
          onClose={onCloseActive}
          onUpdate={handleUpdateAppointment}
        />
      )}
    </>
  );
}
