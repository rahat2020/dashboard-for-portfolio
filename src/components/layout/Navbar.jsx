import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, LogOut, FileText, Folder, Briefcase, Users as UsersIcon } from "react-feather";
import { toggleSidebar } from "../../features/ui/uiSlice";
import { logout, selectCurrentUserData } from "../../features/auth/authSlice";
import { useGetPostsQuery } from "../../features/posts/postsApi";
import { useGetProjectsQuery } from "../../features/projects/projectsApi";
import { useGetExperiencesQuery } from "../../features/experiences/experiencesApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import NotificationBell from "./NotificationBell";
import toast from "react-hot-toast";

const pageTitles = {
  "/": "Dashboard",
  "/posts": "Posts",
  "/projects": "Projects",
  "/experiences": "Experiences",
  "/users": "Users",
  "/settings": "Settings",
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const userData = useSelector(selectCurrentUserData);

  const currentTitle =
    Object.entries(pageTitles).find(([path]) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path),
    )?.[1] || "Dashboard";

  const [query, setQuery] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const searchRef = useRef(null);

  const { data: postsData } = useGetPostsQuery();
  const { data: projectsData } = useGetProjectsQuery();
  const { data: experiencesData } = useGetExperiencesQuery();
  const { data: usersData } = useGetUsersQuery();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = query.trim().toLowerCase();
  const matches = (text) => !!text && text.toLowerCase().includes(q);

  const results = q
    ? [
        ...(postsData?.data || [])
          .filter((p) => matches(p.title))
          .map((p) => ({ id: p._id, icon: FileText, label: p.title, sublabel: "Post", path: `/posts/${p._id}` })),
        ...(projectsData?.data || [])
          .filter((p) => matches(p.title))
          .map((p) => ({ id: p._id, icon: Folder, label: p.title, sublabel: "Project", path: `/projects/${p._id}` })),
        ...(experiencesData?.data || [])
          .filter((e) => matches(e.company) || matches(e.position))
          .map((e) => ({ id: e._id, icon: Briefcase, label: `${e.position} · ${e.company}`, sublabel: "Experience", path: "/experiences" })),
        ...(usersData?.data || [])
          .filter((u) => matches(u.name) || matches(u.email))
          .map((u) => ({ id: u._id, icon: UsersIcon, label: u.name, sublabel: u.email, path: "/users" })),
      ].slice(0, 8)
    : [];

  const handleResultClick = (path) => {
    navigate(path);
    setQuery("");
    setResultsOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-20 h-16 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 
        flex items-center justify-between px-4 sm:px-6 transition-all duration-300
        ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-64"}`}
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
        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg">
            <Search size={15} className="text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setResultsOpen(true);
              }}
              onFocus={() => setResultsOpen(true)}
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-48"
            />
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] text-gray-500 bg-gray-700/50 rounded border border-gray-600/50 font-mono">
              ⌘K
            </kbd>
          </div>

          {resultsOpen && q && (
            <div className="absolute top-full mt-2 left-0 w-80 max-h-96 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-30 py-1">
              {results.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-500">No results found</p>
              ) : (
                results.map((r) => (
                  <button
                    key={`${r.sublabel}-${r.id}`}
                    onClick={() => handleResultClick(r.path)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                      <r.icon size={14} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-200 truncate">{r.label}</p>
                      <p className="text-xs text-gray-500 truncate">{r.sublabel}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User */}
        <div className="flex items-center gap-3 pl-3 ml-1 border-l border-gray-800">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-200">{userData?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">{userData?.email || "admin@portfolio.dev"}</p>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              toast.success("Logged out successfully");
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
