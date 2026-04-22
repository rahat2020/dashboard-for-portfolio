import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut } from 'react-feather';
import { toggleSidebar } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const pageTitles = {
  '/': 'Dashboard',
  '/posts': 'Posts',
  '/projects': 'Projects',
  '/experiences': 'Experiences',
  '/users': 'Users',
  '/settings': 'Settings',
};

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const currentTitle = Object.entries(pageTitles).find(([path]) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  )?.[1] || 'Dashboard';

  return (
    <header
      className={`sticky top-0 z-20 h-16 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 
        flex items-center justify-between px-4 sm:px-6 transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-white">{currentTitle}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search (desktop) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg">
          <Search size={15} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-48"
          />
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] text-gray-500 bg-gray-700/50 rounded border border-gray-600/50 font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-gray-950" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 ml-1 border-l border-gray-800">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-200">Admin</p>
            <p className="text-xs text-gray-500">admin@portfolio.dev</p>
          </div>
          <button 
            onClick={() => {
              dispatch(logout());
              toast.success('Logged out successfully');
            }}
            className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all cursor-pointer border border-gray-700"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
