//src/app/dashboard/components/chatbot/index.jsx
'use client';
import React, { useState } from 'react';
import styles from './style.module.scss';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Hallo, ik ben Nexi, je AI-assistent van Nexgenda! Hoe kan ik je helpen vandaag?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const quickActions = [
    'Wat moet ik vandaag doen?',
    'Welke deadlines zijn er in de toekomst?',
    'Welke meetings zijn er vandaag?',
    'Welke meetings zijn er in de toekomst?'
  ];

  const loadAgenda = () => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  };
  
  const handleSend = async (text) => {
    const messageText = text !== undefined ? text : input.trim();
    if (!messageText) return;
    if (text === undefined) setInput('');
  
    const newMessages = [
      ...messages,
      { message: messageText, sender: 'user' }
    ];
    setMessages(newMessages);
    setTyping(true);
  
    try {
      const res = await fetch('http://localhost:1337/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: messageText,
          agenda: loadAgenda()
        })
      });
      const { answer } = await res.json();
  
      // Probeer te parsen als JSON
      try {
        const parsed = JSON.parse(answer);
  
        // 👉 NIEUWE AFSPRAAK
        if (parsed?.title && parsed?.date && parsed?.time && parsed?.duration_minutes) {
          const datetime = `${parsed.date}T${parsed.time}`;
          const end = new Date(datetime);
          end.setMinutes(end.getMinutes() + parsed.duration_minutes);
  
          const url = new URL(window.location.origin + '/dashboard');
          url.searchParams.set('title', parsed.title);
          url.searchParams.set('start', new Date(datetime).toISOString());
          url.searchParams.set('end', end.toISOString());
          url.searchParams.set('color', 'blue');
          window.location.href = url.toString();
          return;
        }
  
        // 👉 BESTAANDE AFSPRAAK AANPASSEN
        if (parsed?.action === 'update') {
          const updatedAgenda = loadAgenda().map(item => {
            if (item.title === parsed.target_title) {
              const newStart = `${parsed.new_date}T${parsed.new_time}`;
              const startDate = new Date(newStart);
              const oldStart = new Date(item.start);
              const oldEnd = new Date(item.end);
              const duration = (oldEnd.getTime() - oldStart.getTime()) / 60000; // in minuten
              const newEnd = new Date(startDate.getTime() + duration * 60000);
  
              return {
                ...item,
                start: startDate.toISOString(),
                end: newEnd.toISOString(),
                datetime: newStart
              };
            }
            return item;
          });
  
          localStorage.setItem('appointments', JSON.stringify(updatedAgenda));
          window.location.reload();
          return;
        }
  
      } catch (e) {
        // geen JSON, behandel als gewoon antwoord
      }
  
      setMessages([
        ...newMessages,
        { message: answer, sender: 'bot' }
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { message: 'Sorry, er ging iets mis. Probeer het later opnieuw.', sender: 'bot' }
      ]);
    } finally {
      setTyping(false);
    }
  };
  
  
  const onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatbotcontainer}>
      <h4 className={styles.quickH4}>Quick Actions</h4>
      <div className={styles.quickButtons}>
        {quickActions.map((label, idx) => (
          <button
            key={idx}
            className={styles.quickButton}
            onClick={() => handleSend(label)}
            disabled={typing}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.chathistory}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={m.sender === 'user' ? styles.usermessage : styles.aimessage}
          >
            {m.message}
          </div>
        ))}
        {typing && (
          <div className={styles.aimessage}>Nexi is aan het typen…</div>
        )}
      </div>

      <div className={styles.inputcontainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Typ hier..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={typing}
        />
        <button
          className={styles.button}
          onClick={() => handleSend()}
          disabled={typing || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
