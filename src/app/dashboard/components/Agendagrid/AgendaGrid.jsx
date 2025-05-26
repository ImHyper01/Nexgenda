'use client';
import React, { useState } from 'react';
import styles            from './style.module.scss';
import {
  startOfWeek, addDays, format,
  setHours, isSameDay, isWithinInterval
} from 'date-fns';

const hours = Array.from({ length: 10 }, (_, i) => 8 + i);

export default function AgendaGrid({ appointments, onAdd, onRemove }) {
  const [weekStart, setWeekStart]         = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selected, setSelected]           = useState(null);
  const [suggestions, setSuggestions]     = useState([]);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const prev = () => setWeekStart(d => addDays(d, -7));
  const next = () => setWeekStart(d => addDays(d,  7));

  // Zoek eerste 3 vrije 1u-blokken in deze week
  const computeSuggestions = () => {
    const free = [];
    days.forEach(day => {
      hours.forEach(hour => {
        const slotStart = setHours(day, hour);
        const slotEnd   = setHours(day, hour + 1);
        const overlap = appointments.some(app =>
          isSameDay(app.start, day) &&
          isWithinInterval(slotStart, { start: app.start, end: app.end }) ||
          isWithinInterval(slotEnd,   { start: app.start, end: app.end })
        );
        if (!overlap) free.push({ title: 'Voorstel afspraak', start: slotStart, end: slotEnd });
      });
    });
    free.sort((a,b) => a.start - b.start);
    setSuggestions(free.slice(0,3));
    setShowSuggestModal(true);
  };

  return (
    <div className={styles.wrapper}>
      {/* Header met slimme voorstel-knop */}
      <div className={styles.navbar}>
        <button onClick={prev}>← Vorige</button>
        <h2>Week van {format(weekStart, 'dd MMM yyyy')}</h2>
        <button onClick={next}>Volgende →</button>
        <button className={styles.suggestButton} onClick={computeSuggestions}>
          🎯 Slim voorstel
        </button>
      </div>

      {/* Agenda-grid */}
      <div className={styles.grid}>
        <div className={styles.timeHeader}></div>
        {days.map((day,i) => (
          <div key={i} className={styles.dayHeader}>
            {format(day, 'EEEE dd/MM')}
          </div>
        ))}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className={styles.timeLabel}>{hour}:00</div>
            {days.map((day,j) => {
              const time = setHours(day, hour);
              const appt = appointments.find(a =>
                isSameDay(a.start, day) &&
                isWithinInterval(time, { start: a.start, end: a.end })
              );
              return (
                <div key={`${j}-${hour}`} className={styles.cell}>
                  {appt && (
                    <div
                      className={styles.appointment}
                      onClick={() => setSelected(appt)}
                    >
                      {appt.title}
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
            <ul>
              {suggestions.map((slot,i) => (
                <li key={i} className={styles.suggestItem}>
                  <span>
                    {format(slot.start, 'EEEE dd/MM HH:mm')} – {format(slot.end, 'HH:mm')}
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
