import HeaderLogOut from '../../components/header-logout';
import Sidebar from '../dashboard/components/Sidebar';
import Agenda from '../dashboard/components/Agenda';

export default function DashboardRoute() {
  return (
    <div>
      <HeaderLogOut />
      <div>
      <Agenda />
      </div>
    </div>
  );
}