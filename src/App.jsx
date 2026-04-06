import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Toaster } from 'react-hot-toast';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import PostsPage from './pages/PostsPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Dashboard Routes with Layout */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="experiences" element={<ExperiencesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        
        {/* Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'bg-gray-900 text-gray-200 border border-gray-800',
            style: {
              background: '#111827',
              color: '#f3f4f6',
              border: '1px solid #1f2937',
            },
            success: {
              iconTheme: {
                primary: '#8b5cf6',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
