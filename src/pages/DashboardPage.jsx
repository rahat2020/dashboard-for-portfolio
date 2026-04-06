import { useState, useEffect } from 'react';
import {
  FileText, Folder, Briefcase, Users, TrendingUp, TrendingDown,
  ArrowUpRight, Cloud, Sun, CloudRain, CloudSnow, Wind, Droplet,
  Eye, Clock, Star
} from 'react-feather';
import { useGetPostsQuery } from '../features/posts/postsApi';
import { useGetProjectsQuery } from '../features/projects/projectsApi';
import { useGetExperiencesQuery } from '../features/experiences/experiencesApi';
import { useGetUsersQuery } from '../features/users/usersApi';
import Loader from '../components/ui/Loader';

// --- Summary Card ---
const SummaryCard = ({ title, value, icon: Icon, trend, trendValue, color, loading }) => {
  const colorMap = {
    violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', border: 'border-violet-500/20', shadow: 'shadow-violet-500/5' },
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', border: 'border-blue-500/20', shadow: 'shadow-blue-500/5' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/5' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', border: 'border-amber-500/20', shadow: 'shadow-amber-500/5' },
  };

  const c = colorMap[color] || colorMap.violet;

  return (
    <div className={`relative overflow-hidden bg-gray-900/80 border ${c.border} rounded-xl p-5 shadow-lg ${c.shadow} 
      hover:border-opacity-50 transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-800 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          )}
          {trendValue && (
            <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
              ${trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
              {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`${c.bg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className={c.icon} />
        </div>
      </div>
      {/* Decorative gradient */}
      <div className={`absolute -bottom-8 -right-8 w-24 h-24 ${c.bg} rounded-full blur-2xl opacity-30 
        group-hover:opacity-50 transition-opacity duration-500`} />
    </div>
  );
};

// --- Weather Widget ---
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=23.81&longitude=90.41&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto');
        const data = await res.json();
        setWeather(data);
      } catch {
        // Fallback mock
        setWeather({
          current: { temperature_2m: 28, relative_humidity_2m: 72, wind_speed_10m: 12, weather_code: 1 },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherInfo = (code) => {
    if (code <= 1) return { icon: Sun, label: 'Clear Sky', gradient: 'from-amber-500 to-orange-600' };
    if (code <= 3) return { icon: Cloud, label: 'Partly Cloudy', gradient: 'from-gray-400 to-gray-600' };
    if (code <= 48) return { icon: Cloud, label: 'Foggy', gradient: 'from-gray-500 to-gray-700' };
    if (code <= 67) return { icon: CloudRain, label: 'Rainy', gradient: 'from-blue-400 to-blue-600' };
    if (code <= 77) return { icon: CloudSnow, label: 'Snow', gradient: 'from-blue-200 to-blue-400' };
    return { icon: CloudRain, label: 'Stormy', gradient: 'from-gray-600 to-gray-800' };
  };

  if (loading) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 flex items-center justify-center h-48">
        <Loader />
      </div>
    );
  }

  const current = weather?.current;
  const info = getWeatherInfo(current?.weather_code || 0);
  const WeatherIcon = info.icon;

  return (
    <div className="relative overflow-hidden bg-gray-900/80 border border-gray-800 rounded-xl p-6">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Cloud size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Weather</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-white">{Math.round(current?.temperature_2m || 0)}</span>
              <span className="text-lg text-gray-400 mb-1">°C</span>
            </div>
            <p className="text-sm text-gray-400">{info.label}</p>
            <p className="text-xs text-gray-500 mt-1">Dhaka, Bangladesh</p>
          </div>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-lg`}>
            <WeatherIcon size={28} className="text-white" />
          </div>
        </div>
        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <Droplet size={14} className="text-blue-400" />
            <span className="text-xs text-gray-400">{current?.relative_humidity_2m}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400">{current?.wind_speed_10m} km/h</span>
          </div>
        </div>
      </div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl" />
    </div>
  );
};

// --- Recent Activity Item ---
const ActivityItem = ({ title, category, type, time }) => {
  const icons = {
    post: FileText,
    project: Folder,
    experience: Briefcase,
  };
  const Icon = icons[type] || FileText;

  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-800/30 rounded-lg transition-colors group">
      <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 
        group-hover:bg-violet-500/10 transition-colors">
        <Icon size={16} className="text-gray-500 group-hover:text-violet-400 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200 truncate">{title}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
        <Clock size={12} />
        {time}
      </div>
    </div>
  );
};

// --- Mock Data ---
const mockRecentActivity = [
  { title: 'Building a REST API with Node.js', category: 'Tutorial', type: 'post', time: '2h ago' },
  { title: 'E-Commerce Platform', category: 'Full Stack', type: 'project', time: '4h ago' },
  { title: 'React Design Patterns', category: 'React', type: 'post', time: '6h ago' },
  { title: 'Portfolio Website v3', category: 'Frontend', type: 'project', time: '1d ago' },
  { title: 'Senior Developer at TechCorp', category: 'Experience', type: 'experience', time: '2d ago' },
  { title: 'GraphQL vs REST', category: 'Article', type: 'post', time: '3d ago' },
];

// --- Dashboard Page ---
const DashboardPage = () => {
  const { data: postsData, isLoading: postsLoading } = useGetPostsQuery();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: experiencesData, isLoading: experiencesLoading } = useGetExperiencesQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();

  const stats = [
    {
      title: 'Total Posts',
      value: postsData?.data?.length || 0,
      icon: FileText,
      color: 'violet',
      trend: 'up',
      trendValue: '+12%',
      loading: postsLoading,
    },
    {
      title: 'Total Projects',
      value: projectsData?.data?.length || 0,
      icon: Folder,
      color: 'blue',
      trend: 'up',
      trendValue: '+8%',
      loading: projectsLoading,
    },
    {
      title: 'Total Experiences',
      value: experiencesData?.data?.length || 0,
      icon: Briefcase,
      color: 'emerald',
      trend: 'up',
      trendValue: '+3%',
      loading: experiencesLoading,
    },
    {
      title: 'Total Users',
      value: usersData?.data?.length || 0,
      icon: Users,
      color: 'amber',
      trend: 'up',
      trendValue: '+5%',
      loading: usersLoading,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <SummaryCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Activity</h3>
            </div>
            <button className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 cursor-pointer">
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-800/50 p-2">
            {mockRecentActivity.map((item, idx) => (
              <ActivityItem key={idx} {...item} />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather */}
          <WeatherWidget />

          {/* Quick Stats */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Published Posts</span>
                <span className="text-sm font-semibold text-white">
                  {postsData?.data?.filter?.(p => p.isPublished)?.length || 0}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${postsData?.data?.length ? ((postsData.data.filter(p => p.isPublished)?.length || 0) / postsData.data.length * 100) : 0}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Featured Projects</span>
                <span className="text-sm font-semibold text-white">
                  {projectsData?.data?.filter?.(p => p.isFeatured)?.length || 0}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${projectsData?.data?.length ? ((projectsData.data.filter(p => p.isFeatured)?.length || 0) / projectsData.data.length * 100) : 0}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Page Views</span>
                <span className="text-sm font-semibold text-white">12.4K</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-[72%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
