// src/app/dashboard/ClientDashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { parseISO } from 'date-fns';

import AgendaGrid from './components/Agendagrid/AgendaGrid';
import Sidebar from './components/Sidebar';

// Typedef voor raw data in localStorage
interface RawAppointment {
  id: string;
  title: string;
  start: string;
  end: string;
  color?: string;
  files?: unknown[];
}

// Typedef voor afspraken in React State
export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  files?: unknown[];
}

const STORAGE_KEY = 'appointments';

export default function ClientDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);

  // 1️⃣ Laad & sync localStorage
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const raw = JSON.parse(saved) as RawAppointment[];
        const parsed = raw.map((a) => ({
          id: a.id,
          title: a.title,
          start: parseISO(a.start),
          end: parseISO(a.end),
          color: a.color,
          files: a.files,
        }));
        setAppointments(parsed);
      }
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  // 2️⃣ Persisteer wijzigingen automatisch
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  // 3️⃣ Reactief op externe events (bijv. chatbot)
  useEffect(() => {
    const onUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const raw = JSON.parse(stored) as RawAppointment[];
        setAppointments(
          raw.map((a) => ({
            id: a.id,
            title: a.title,
            start: parseISO(a.start),
            end: parseISO(a.end),
            color: a.color,
            files: a.files,
          }))
        );
      }
    };
    window.addEventListener('agenda-updated', onUpdate);
    return () => window.removeEventListener('agenda-updated', onUpdate);
  }, []);

  // 4️⃣ URL-query → nieuwe afspraak
  useEffect(() => {
    const title = searchParams.get('title');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const color = searchParams.get('color') ?? 'blue';
    const filesParam = searchParams.get('files');

    if (title && start && end) {
      setAppointments((prev) => [
        ...prev,
        {
          id: '_' + Math.random().toString(36).substr(2, 9),
          title,
          start: parseISO(start),
          end: parseISO(end),
          color,
          files: filesParam ? JSON.parse(filesParam) : [],
        },
      ]);
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, router]);

  const handleAdd = (appt: Appointment) => {
    setAppointments((prev) => [
      ...prev,
      { ...appt, id: '_' + Math.random().toString(36).substr(2, 9) },
    ]);
  };
  const handleRemove = (id: string) =>
    setAppointments((prev) => prev.filter((a) => a.id !== id));

  return (
    <>
      <AgendaGrid
        appointments={appointments}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onSelect={setActiveAppointment}  // nu toegestaan, want we definiëren de types hier
      />
      <Sidebar
        activeAppointment={activeAppointment}
        onCloseActive={() => setActiveAppointment(null)}
      />
    </>
  );
}
