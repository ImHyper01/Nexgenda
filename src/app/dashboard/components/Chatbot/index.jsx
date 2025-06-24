'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const quickActions = [
    'Wat moet ik vandaag doen?',
    'Welke deadlines zijn er in de toekomst?',
    'Welke meetings zijn er vandaag?',
    'Welke meetings zijn er in de toekomst?'
  ];

  // Initialiseer Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Deze browser ondersteunt geen spraakherkenning.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      handleSend(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Spraakherkenningsfout:', event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/chat/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: messageText,
            agenda: loadAgenda()
          })
        }
      );

      const { answer } = await res.json();

      try {
        const parsed = JSON.parse(answer);

        if (parsed?.action === 'reschedule') {
          const stored = loadAgenda();
          const updated = stored.map(item => {
            if (item.title.toLowerCase() === parsed.target_title.toLowerCase()) {
              const newStart = `${parsed.new_date}T${parsed.new_time}`;
              const oldStart = new Date(item.start);
              const oldEnd = new Date(item.end);
              const duration = (oldEnd - oldStart) / 60000;
              const newEnd = new Date(new Date(newStart).getTime() + duration * 60000);

              return {
                ...item,
                start: new Date(newStart).toISOString(),
                end: newEnd.toISOString()
              };
            }
            return item;
          });
          localStorage.setItem('appointments', JSON.stringify(updated));
          window.dispatchEvent(new Event('agenda-updated'));
          return;
        }

        if (Array.isArray(parsed)) {
          const stored = loadAgenda();
          const newAppointments = parsed.map(p => {
            const datetime = `${p.date}T${p.time}`;
            const end = new Date(datetime);
            end.setMinutes(end.getMinutes() + p.duration_minutes);
            return {
              id: '_' + Math.random().toString(36).substr(2, 9),
              title: p.title,
              start: new Date(datetime).toISOString(),
              end: end.toISOString(),
              color: 'blue',
              files: []
            };
          });
          localStorage.setItem('appointments', JSON.stringify([...stored, ...newAppointments]));
          window.dispatchEvent(new Event('agenda-updated'));
          return;
        }

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

      } catch (e) {
        // Geen JSON – behandel als tekst
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

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      setListening(true);
      recognitionRef.current.start();
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
          className={styles.micButton}
          onClick={toggleListening}
          disabled={typing}
          title={listening ? 'Stop spraakherkenning' : 'Start spraakherkenning'}
        >
          {listening ? '🎙️' : '🎤'}
        </button>
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
