'use client';

import React, { useState } from 'react';
import styles from './style.module.scss';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Hallo, ik ben Soul, je AI-klantenservice-assistent van Coolblue! Hoe kan ik je helpen?",
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
        body: JSON.stringify({ question: messageText })
      });
      const { answer } = await res.json();

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
          <div className={styles.aimessage}>Soul is aan het typen…</div>
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
