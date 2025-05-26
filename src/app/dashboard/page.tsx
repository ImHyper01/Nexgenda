'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams }      from 'next/navigation';
import { addHours }             from 'date-fns';

import HeaderLogOut             from '../../components/header-logout';
import Topbar                   from '../dashboard/components/Topbar';
import Sidebar                  from '../dashboard/components/Sidebar';
import AgendaGrid               from './components/Agendagrid/AgendaGrid';
import styles                   from './style.module.scss';

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const initialAppointments = [
  {
    id:    generateId(),
    title: "Team meeting",
    start: new Date("2025-04-21T10:00:00"),
    end:   new Date("2025-04-21T11:00:00")
  },
  {
    id:    generateId(),
    title: "Lunch",
    start: new Date("2025-04-22T12:00:00"),
    end:   new Date("2025-04-22T13:00:00")
  }
];

export default function DashboardRoute() {
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState(initialAppointments);

  // Callback om een nieuwe afspraak toe te voegen
  const handleAdd = (appt) => {
    setAppointments(prev => [
      ...prev.filter(a =>
        !(a.title === appt.title && a.start.getTime() === appt.start.getTime())
      ),
      { ...appt, id: generateId() }
    ]);
  };

  // Callback om een afspraak te verwijderen
  const handleRemove = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Als je navigeert met ?title=&date=, voegen we die afspraak ook toe
  useEffect(() => {
    const title = searchParams.get('title');
    const date  = searchParams.get('date');
    if (title && date) {
      const start = new Date(date);
      const end   = addHours(start, 1);
      handleAdd({ title, start, end });
    }
  }, [searchParams]);

  return (
    <div>
      <HeaderLogOut />
      <Topbar />
      <div className={styles.mainLayout}>
        <AgendaGrid
          appointments={appointments}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
        <Sidebar />
      </div>
    </div>
  );
}
