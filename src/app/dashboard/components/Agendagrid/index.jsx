'use client';
import React, { useState } from 'react';
import styles from './style.module.scss';
import { startOfWeek, addDays, format, addHours, setHours, isSameDay, isWithinInterval } from 'date-fns';

const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 08:00 - 18:00

export default function AgendaGrid({ appointments }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const nextWeek = () => setCurrentWeekStart(prev => addDays(prev, 7));
  const prevWeek = () => setCurrentWeekStart(prev => addDays(prev, -7));

  return (
    <div>
      {/* Week Navigatie */}
      <div className={styles.navbar}>
        <button onClick={prevWeek}>← Vorige</button>
        <h2>Week van {format(currentWeekStart, 'dd MMM yyyy')}</h2>
        <button onClick={nextWeek}>Volgende →</button>
      </div>

      {/* Agenda Grid */}
      <div className={styles.grid}>
        {/* Headers */}
        <div className={styles.timeHeader}></div>
        {days.map((day, i) => (
          <div key={i} className={styles.dayHeader}>
            {format(day, 'EEEE dd/MM')}
          </div>
        ))}

        {/* Uren + Cellen */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className={styles.timeLabel}>{hour}:00</div>
            {days.map((day, i) => {
              const cellTime = setHours(day, hour);
              const appointment = appointments.find(app =>
                isSameDay(app.start, day) &&
                isWithinInterval(cellTime, { start: app.start, end: app.end })
              );
              return (
                <div key={i + '-' + hour} className={styles.cell}>
                  {appointment && (
                    <div className={styles.appointment}>
                      {appointment.title}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
