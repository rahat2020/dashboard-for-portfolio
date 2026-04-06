import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Home,
  FileText,
  Folder,
  Briefcase,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'react-feather';
import { toggleSidebarCollapse, setSidebarOpen } from '../../features/ui/uiSlice';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/posts', label: 'Posts', icon: FileText },
  { path: '/projects', label: 'Projects', icon: Folder },
  { path: '/experiences', label: 'Experiences', icon: Briefcase },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, sidebarCollapsed } = useSelector((state) => state.ui);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 
          flex flex-col transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-gray-800 px-4 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
            <Zap size={18} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-white tracking-tight leading-none">Admin Panel</h1>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Portfolio Dashboard</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => window.innerWidth < 1024 && dispatch(setSidebarOpen(false))}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-violet-600/15 text-violet-400 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet-500 rounded-r-full" />
                )}
                <Icon size={19} className={`flex-shrink-0 ${isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                {!sidebarCollapsed && <span>{label}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-xs text-gray-200 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50">
                    {label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle - Desktop only */}
        <div className="hidden lg:flex items-center justify-center p-3 border-t border-gray-800">
          <button
            onClick={() => dispatch(toggleSidebarCollapse())}
            className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-300 
              hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
