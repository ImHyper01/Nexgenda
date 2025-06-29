// src/app/dashboard/components/Agendagrid/AgendaGrid.jsx
'use client';

import React, { useState } from 'react';
import {
  startOfWeek,
  addDays,
  addHours,
  format,
  isSameDay,
  isWithinInterval,
  differenceInHours
} from 'date-fns';
import styles from './style.module.scss';

const hours = Array.from({ length: 10 }, (_, i) => 8 + i);

const colorMap = {
  red:    '#f87171',
  yellow: '#facc15',
  green:  '#4ade80',
  blue:   '#60a5fa'
};

export default function AgendaGrid({
  appointments,
  onAdd,
  onRemove,
  onSelect      // ← prop toegevoegd
}) {
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selected, setSelected] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const prev = () => setWeekStart(d => addDays(d, -7));
  const next = () => setWeekStart(d => addDays(d, 7));

  const computeSuggestionsForDay = (day) => {
    const apptsToday = appointments.filter(a =>
      isSameDay(a.start, day)
    );

    const suggestionHours = Array.from({ length: 9 }, (_, i) => 8 + i);
    const freieSlots = suggestionHours
      .map(hour => {
        const slotStart = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          hour, 0, 0
        );
        const slotEnd = addHours(slotStart, 1);

        const overlaps = apptsToday.some(a =>
          a.start < slotEnd && a.end > slotStart
        );

        return overlaps
          ? null
          : {
              id:    slotStart.toISOString(),
              title: 'Vrij',
              start: slotStart,
              end:   slotEnd,
              color: 'green'
            };
      })
      .filter(Boolean);

    setSuggestions(freieSlots);
    setShowSuggestModal(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        <button onClick={prev}>← Vorige</button>
        <h2>Week van {format(weekStart, 'dd MMM yyyy')}</h2>
        <button onClick={next}>Volgende →</button>
        <button
          className={styles.suggestButton}
          onClick={() => computeSuggestionsForDay(new Date())}
        >
          🎯 Slimme Suggesties
        </button>
      </div>

      <div className={styles.dayHeaderRow}>
        <div className={styles.timeHeader}></div>
        {days.map((day, i) => (
          <div
            key={i}
            className={styles.dayHeader}
            onClick={() => computeSuggestionsForDay(day)}
          >
            {format(day, 'EEEE dd/MM')}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {hours.map((hour, rowIndex) => (
          <React.Fragment key={hour}>
            <div
              className={styles.timeLabel}
              style={{
                gridColumn: 1,
                gridRow:    rowIndex + 1
              }}
            >
              {hour}:00
            </div>

            {days.map((day, colIndex) => (
              <div
                key={`${colIndex}-${hour}`}
                className={styles.cell}
                style={{
                  gridColumn: colIndex + 2,
                  gridRow:    rowIndex + 1
                }}
              />
            ))}
          </React.Fragment>
        ))}

        {appointments.map((a) => {
          const dayIdx = days.findIndex((d) => isSameDay(d, a.start));
          if (dayIdx === -1) return null;
          const startHour = a.start.getHours();
          const endHour   = a.end.getHours();
          let duur = differenceInHours(a.end, a.start);
          if (duur < 1) duur = 1;
          const rowStart = (startHour - 8) + 1;

          return (
            <div
              key={a.id}
              className={styles.appointment}
              onClick={() => {
                setSelected(a);
                onSelect?.(a);      // ← 'onSelect' aanroepen als meegegeven
              }}
              style={{
                gridColumn:      dayIdx + 2,
                gridRow:         `${rowStart} / span ${duur}`,
                backgroundColor: colorMap[a.color] || '#d1d5db'
              }}
            >
              <span className={styles.appointmentTitle}>{a.title}</span>
              <span className={styles.appointmentTime}>
                {format(a.start, 'HH:mm')}
              </span>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h3>{selected.title}</h3>
            <p>
              Start: {selected.start.toLocaleString()}<br />
              Eind:  {selected.end.toLocaleString()}
            </p>
            <button
              className={styles.deleteButton}
              onClick={() => {
                onRemove(selected.id);
                setSelected(null);
              }}
            >
              Verwijder afspraak
            </button>
          </div>
        </div>
      )}

      {showSuggestModal && (
        <div className={styles.overlay} onClick={() => setShowSuggestModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setShowSuggestModal(false)}
            >
              ×
            </button>
            <h3>Beschikbare blokken (1u)</h3>
            <ul className={styles.suggestList}>
              {suggestions.map((slot, i) => (
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
