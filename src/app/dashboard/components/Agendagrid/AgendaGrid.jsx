'use client';
import React, { useState } from 'react';
import styles            from './style.module.scss';
import {
  startOfWeek, addDays, format,
  setHours, isSameDay, isWithinInterval
} from 'date-fns';

const hours = Array.from({ length: 10 }, (_, i) => 8 + i);
const colorMap = {
  red:    '#f87171',
  yellow: '#facc15',
  green:  '#4ade80',
  blue:   '#60a5fa'
};

export default function AgendaGrid({ appointments, onAdd, onRemove }) {
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selected, setSelected]           = useState(null);
  const [suggestions, setSuggestions]     = useState([]);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const prev = () => setWeekStart(d => addDays(d, -7));
  const next = () => setWeekStart(d => addDays(d,  7));

  const computeSuggestionsForDay = day => {
    const free = [];
    hours.forEach(hour => {
      const s = setHours(day, hour), e = setHours(day, hour+1);
      const overlap = appointments.some(a =>
        isSameDay(a.start, day) &&
        ( isWithinInterval(s, { start: a.start, end: a.end }) ||
          isWithinInterval(e, { start: a.start, end: a.end }) )
      );
      if (!overlap) free.push({ title: 'Voorstel', start: s, end: e, color: 'blue' });
    });
    setSuggestions(free.slice(0,3));
    setShowSuggestModal(true);
  };

  return (
    <div className={styles.wrapper}>
      {/* Navigatie */}
      <div className={styles.navbar}>
        <button onClick={prev}>← Vorige</button>
        <h2>Week van {format(weekStart, 'dd MMM yyyy')}</h2>
        <button onClick={next}>Volgende →</button>
        <button
          className={styles.suggestButton}
          onClick={() => computeSuggestionsForDay(new Date())}
        >
          🎯 Suggestie
        </button>
      </div>

      {/* Dagheaders (zonder per-dag knoppen) */}
      <div className={styles.dayHeaderRow}>
        <div className={styles.timeHeader}></div>
        {days.map((day,i) => (
          <div key={i} className={styles.dayHeader}>
            {format(day, 'EEEE dd/MM')}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className={styles.timeLabel}>{hour}:00</div>
            {days.map((day,j) => {
              const t = setHours(day, hour);
              const a = appointments.find(a =>
                isSameDay(a.start, day) &&
                isWithinInterval(t, { start: a.start, end: a.end })
              );
              return (
                <div key={`${j}-${hour}`} className={styles.cell}>
                  {a && (
                    <div
                      className={styles.appointment}
                      style={{ backgroundColor: colorMap[a.color] }}
                      onClick={() => setSelected(a)}
                    >
                      <span className={styles.appointmentTitle}>
                        {a.title}
                      </span>
                      <span className={styles.appointmentTime}>
                        {format(a.start, 'HH:mm')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Detail-modal */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelected(null)}>×</button>
            <h3>{selected.title}</h3>
            <p>
              Start: {selected.start.toLocaleString()}<br/>
              Eind:  {selected.end.toLocaleString()}
            </p>
            <button
              className={styles.deleteButton}
              onClick={() => { onRemove(selected.id); setSelected(null); }}
            >
              Verwijder afspraak
            </button>
          </div>
        </div>
      )}

      {/* Suggestie-modal */}
      {showSuggestModal && (
        <div className={styles.overlay} onClick={() => setShowSuggestModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowSuggestModal(false)}>×</button>
            <h3>Beschikbare blokken (1u)</h3>
            <ul className={styles.suggestList}>
              {suggestions.map((slot,i) => (
                <li key={i} className={styles.suggestItem}>
                  <span>
                    {format(slot.start, 'EEEE dd/MM HH:mm')} – {format(slot.end,'HH:mm')}
                  </span>
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      onAdd(slot);
                      setShowSuggestModal(false);
                    }}
                  >
                    Inplannen
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
