// src/components/AgendaGrid.jsx

import React, { useState } from 'react';
import axios from 'axios';
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isWithinInterval,
  differenceInHours
} from 'date-fns';
import styles from './style.module.scss'; // ga ervan uit dat je CSS/SCSS-laag op orde is

// Uren-periode die je in de grid toont (8:00–18:00 is hier 8 t/m 17, dus 10 uur)
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
  const prev = () => setWeekStart((d) => addDays(d, -7));
  const next = () => setWeekStart((d) => addDays(d, 7));

  // =========================
  // Vervang hier je lokale "computeSuggestionsForDay" door een call naar Strapi v5
  // =========================
  const computeSuggestionsForDay = async (day) => {
    try {
      // 1) Bepaal het begin en einde van de week (maandag t/m zondag) waarin 'day' valt
      const weekStartDate = startOfWeek(day, { weekStartsOn: 1 });
      const weekEndDate = addDays(weekStartDate, 6);

      // 2) Filter alle bestaande afspraken (props) die binnen die week vallen
      //    en zet ze om naar ISO-strings zoals de backend dat verwacht.
      const appointmentsThisWeek = appointments
        .filter((a) =>
          isWithinInterval(a.start, { start: weekStartDate, end: weekEndDate })
        )
        .map((a) => ({
          start: a.start.toISOString(),
          end:   a.end.toISOString(),
        }));

      // 3) Doe de POST-aanroep naar Strapi v5 endpoint
      //    Vervang hieronder ’http://localhost:1337’ door jouw Strapi-url + poort
      const response = await axios.post(
        'http://localhost:1337/api/agenda/slimme-voorstel',
        { appointments: appointmentsThisWeek }
      );

      // 4) Parse de respons (array met { id, title, start, end, color })
      const suggestionsFromApi = response.data.data.map((s) => ({
        id:    s.id,
        title: s.title,
        start: new Date(s.start),
        end:   new Date(s.end),
        color: s.color,
      }));

      setSuggestions(suggestionsFromApi);
      setShowSuggestModal(true);
    } catch (err) {
      console.error('Fout bij ophalen slimme voorstellen:', err);
      alert('Kon geen slimme voorstellen ophalen. Kijk in de serverlogs voor details.');
    }
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
          🎯 Slimme Suggestie
        </button>
      </div>

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
          1) Eerst renderen we elk tijd-label + lege cellen.
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
                  gridColumn: colIndex + 2, // kolom 2 = maandag, 3 = dinsdag, etc.
                  gridRow:    rowIndex + 1   //zelfde rij als het tijd-label
                }}
              />
            ))}
          </React.Fragment>
        ))}

        {/*
          2) Render alle bestaande afspraken als balken.
             We zetten expliciet gridColumn en gridRow, zodat
             een meer-uur-afspraak één div blijft, met span van x rijen.
        */}
        {appointments.map((a) => {
          const dayIdx = days.findIndex((d) => isSameDay(d, a.start));
          if (dayIdx === -1) return null;

          const startHour = a.start.getHours();
          const endHour   = a.end.getHours();
          let duur = differenceInHours(a.end, a.start);
          if (duur < 1) duur = 1; // minstens 1 uur

          const rowStart = (startHour - 8) + 1;

          return (
            <div
              key={a.id}
              className={styles.appointment}
              onClick={() => setSelected(a)}
              style={{
                gridColumn:      dayIdx + 2,
                gridRow:         `${rowStart} / span ${duur}`,
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
        <div
          className={styles.overlay}
          onClick={() => setSelected(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
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
        <div
          className={styles.overlay}
          onClick={() => setShowSuggestModal(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
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
