'use client';
import HeaderLogOut from '../../components/header-logout';
import Topbar from '../dashboard/components/Topbar';
import Agenda from './components/Agendagrid';
import Sidebar from '../dashboard/components/Sidebar';
import styles from './style.module.scss';




const appointments = [
  {
    title: "Team meeting",
    start: new Date("2025-04-21T10:00:00"),
    end: new Date("2025-04-21T11:00:00")
  },
  {
    title: "Lunch",
    start: new Date("2025-04-22T12:00:00"),
    end: new Date("2025-04-22T13:00:00")
  }
];


export default function DashboardRoute() {


    return (
      <div>
        <HeaderLogOut />
        <div>
          <Topbar />
  
          <div className={styles.mainLayout}>
            <Agenda appointments={appointments} />
            <Sidebar  />
          </div>
          
        </div>
      </div>
  );
}