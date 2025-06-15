//src/app/dashboard/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { parseISO } from 'date-fns';

import HeaderLogOut from '../../components/header-logout';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import AgendaGrid from './components/Agendagrid/AgendaGrid';
import styles from './style.module.scss';

const STORAGE_KEY = 'appointments';

export default function DashboardRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);

  // ✅ 1. Laad & update afspraken live vanuit localStorage
  useEffect(() => {
    const loadAppointments = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved).map(a => ({
          ...a,
          start: parseISO(a.start),
          end: parseISO(a.end)
        }));
        setAppointments(arr);
      }
    };

    loadAppointments();
    

    // 🔄 Herlaad bij wijziging in localStorage
    const handler = () => loadAppointments();
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  // 🔄 Luister naar updates vanuit de chatbot
useEffect(() => {
  const reload = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored).map(a => ({
        ...a,
        start: parseISO(a.start),
        end: parseISO(a.end)
      }));
      setAppointments(parsed);
    }
  };

  window.addEventListener('agenda-updated', reload);
  return () => window.removeEventListener('agenda-updated', reload);
}, []);


  // ✅ 2. Persisteer lokaal bij wijziging
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  // ✅ 3. Voeg nieuwe afspraak toe via URL-query (enkel voor enkele afspraken)
  useEffect(() => {
    const title = searchParams.get('title');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const color = searchParams.get('color') ?? 'blue';
    const files = searchParams.get('files');
    if (title && start && end) {
      setAppointments(prev => [
        ...prev,
        {
          id: '_' + Math.random().toString(36).substr(2, 9),
          title,
          start: parseISO(start),
          end: parseISO(end),
          color,
          files: files ? JSON.parse(files) : []
        }
      ]);
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, router]);

  const handleAdd = appt => {
    setAppointments(prev => [
      ...prev,
      { ...appt, id: '_' + Math.random().toString(36).substr(2, 9) }
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
          onClick={setActiveAppointment}
        />
        <Sidebar
          activeAppointment={activeAppointment}
          onCloseActive={() => setActiveAppointment(null)}
        />
      </div>
    </div>
  );
}
