'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { parseISO }        from 'date-fns';

import HeaderLogOut        from '../../components/header-logout';
import Topbar              from '../dashboard/components/Topbar';
import Sidebar             from '../dashboard/components/Sidebar';
import AgendaGrid          from './components/Agendagrid/AgendaGrid';
import styles              from './style.module.scss';

const STORAGE_KEY = 'appointments';

export default function DashboardRoute() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState([]);

  // 1) Laad persistente afspraken
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const arr = JSON.parse(saved).map(a => ({
        ...a,
        start: parseISO(a.start),
        end:   parseISO(a.end)
      }));
      setAppointments(arr);
    }
  }, []);

  // 2) Persisteer bij elke wijziging
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  // 3) Voeg afspraak toe vanuit URL
  useEffect(() => {
    const title = searchParams.get('title');
    const start = searchParams.get('start');
    const end   = searchParams.get('end');
    const color = searchParams.get('color') ?? 'blue';
    if (title && start && end) {
      setAppointments(prev => [
        ...prev,
        {
          id: '_' + Math.random().toString(36).substr(2,9),
          title,
          start: parseISO(start),
          end:   parseISO(end),
          color
        }
      ]);
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, router]);

  const handleAdd = appt => {
    setAppointments(prev => [
      ...prev,
      { ...appt, id: '_' + Math.random().toString(36).substr(2,9) }
    ]);
  };
  const handleRemove = id =>
    setAppointments(prev => prev.filter(a => a.id !== id));

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
