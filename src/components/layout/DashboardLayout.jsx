import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useNotificationSocket from '../../hooks/useNotificationSocket';

const DashboardLayout = () => {
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  useNotificationSocket();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
        <Navbar />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
