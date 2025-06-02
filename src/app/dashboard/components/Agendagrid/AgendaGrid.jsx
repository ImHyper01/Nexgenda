'use client';
import React, { useState } from 'react';
import styles from './style.module.scss';
import {
  startOfWeek,
  addDays,
  format,
  setHours,
  isSameDay,
  isWithinInterval,
  differenceInHours
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
  const [selected, setSelected] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const prev = () => setWeekStart(d => addDays(d, -7));
  const next = () => setWeekStart(d => addDays(d,  7));

  const computeSuggestionsForDay = day => {
    const free = [];
    hours.forEach(hour => {
      const s = setHours(day, hour);
      const e = setHours(day, hour + 1);
      const overlap = appointments.some(a =>
        isSameDay(a.start, day) &&
        (
          isWithinInterval(s, { start: a.start, end: a.end }) ||
          isWithinInterval(e, { start: a.start, end: a.end })
        )
      );
      if (!overlap) {
        free.push({
          id:    `${day.toISOString()}-${hour}`,
          title: 'Voorstel',
          start: s,
          end:   e,
          color: 'blue'
        });
      }
    });
    setSuggestions(free.slice(0, 3));
    setShowSuggestModal(true);
  };

  return (
    <div className={styles.wrapper}>
      {/* ================= NAVIGATIE ================= */}
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

      {/* ================ DAGHEADERS ================ */}
      <div className={styles.dayHeaderRow}>
        <div className={styles.timeHeader}></div>
        {days.map((day, i) => (
          <div key={i} className={styles.dayHeader}>
            {format(day, 'EEEE dd/MM')}
          </div>
        ))}
      </div>

      {/* ================== GRID =================== */}
      <div className={styles.grid}>
        {/*
          1) Eerst renderen we ELKE tijd-label + de lege cellen.
             We geven expliciet gridColumn en gridRow mee per element,
             zodat de tijd-label altijd exact in de eerste kolom links staat.
        */}
        {hours.map((hour, rowIndex) => (
          <React.Fragment key={hour}>
            {/* 1e kolom: het tijd-label */}
            <div
              className={styles.timeLabel}
              style={{
                gridColumn: 1,
                gridRow:    rowIndex + 1
              }}
            >
              {hour}:00
            </div>

            {/* kolom 2 t/m 8: lege cellen (één per dag) */}
            {days.map((day, colIndex) => (
              <div
                key={`${colIndex}-${hour}`}
                className={styles.cell}
                style={{
                  gridColumn: colIndex + 2,       // kolom 2 = maandag, 3 = dinsdag, etc.
                  gridRow:    rowIndex + 1        // dezelfde rij als het tijd-label
                }}
              />
            ))}
          </React.Fragment>
        ))}

        {/*
          2) Render alle afspraken als AANEENGESLOTEN balken.
             We zetten expliciet gridColumn en gridRow, zodat
             een meer-uur-afspraak 1 div blijft, met span van x rijen.
        */}
        {appointments.map(a => {
          // Op welke dag (index 0..6) valt deze afspraak?
          const dayIdx = days.findIndex(d => isSameDay(d, a.start));
          if (dayIdx === -1) return null;

          // Bereken startuur en duur in hele uren
          const startHour = a.start.getHours();
          const endHour   = a.end.getHours();
          let duur = differenceInHours(a.end, a.start);
          if (duur < 1) duur = 1; // minstens 1 uur

          // Reken om naar grid-rij: rij 1 = 8:00–9:00, rij 2 = 9:00–10:00, etc.
          const rowStart = (startHour - 8) + 1;

          return (
            <div
              key={a.id}
              className={styles.appointment}
              onClick={() => setSelected(a)}
              style={{
                gridColumn:     dayIdx + 2,               // 2 = maandag, 3 = dinsdag, ...
                gridRow:        `${rowStart} / span ${duur}`,
                backgroundColor: colorMap[a.color] || '#d1d5db'
              }}
            >
              <span className={styles.appointmentTitle}>
                {a.title}
              </span>
              <span className={styles.appointmentTime}>
                {format(a.start, 'HH:mm')}
              </span>
            </div>
          );
        })}
      </div>

      {/* =============== DETAIL‐MODAL =============== */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
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

      {/* ============= SUGGESTIE‐MODAL ============= */}
      {showSuggestModal && (
        <div className={styles.overlay} onClick={() => setShowSuggestModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
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
