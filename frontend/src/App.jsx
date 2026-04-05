import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ReportGenerator from './pages/ReportGenerator';
import ReportHistory from './pages/ReportHistory';
import LabSettings from './pages/LabSettings';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import useThemeStore from './context/themeStore';
import useAuthStore from './context/authStore';

const PrivateRoute = ({ children, roles = [] }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to='/' replace />;
  }

  return children;
};

function App() {
  const { isDarkMode, initTheme } = useThemeStore();

  React.useEffect(() => {
    initTheme();
  }, []);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Router>
        <div className='min-h-screen bg-white dark:bg-gray-900 flex flex-col'>
          <Header />

          <main className='flex-1 max-w-7xl w-full mx-auto px-4 py-8'>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path='/generate' element={<PrivateRoute><ReportGenerator /></PrivateRoute>} />
              <Route path='/history' element={<PrivateRoute><ReportHistory /></PrivateRoute>} />
              <Route path='/settings' element={<PrivateRoute><LabSettings /></PrivateRoute>} />
              <Route path='/admin' element={<PrivateRoute roles={['master']}><AdminPanel /></PrivateRoute>} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
