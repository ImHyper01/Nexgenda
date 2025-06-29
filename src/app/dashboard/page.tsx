// src/app/dashboard/page.tsx
import React, { Suspense } from 'react';
import HeaderLogOut from '@/components/header-logout';
import Topbar from './components/Topbar';
import styles from './style.module.scss';
import ClientDashboard from './ClientDashboard';

export default function DashboardRoute() {
  return (
    <div>
      <HeaderLogOut />
      <Topbar />
      <div className={styles.mainLayout}>
        <Suspense fallback={<div>Loading dashboard…</div>}>
          <ClientDashboard />
        </Suspense>
      </div>
    </div>
  );
}
