import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ReportGenerator from './pages/ReportGenerator';
import ReportHistory from './pages/ReportHistory';
import LabSettings from './pages/LabSettings';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
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
  const token = useAuthStore((state) => state.token);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token, refreshUser]);

  return (
    <div>
      <Router>
        <div className='min-h-screen text-slate-900'>
          <div className='flex min-h-screen flex-col md:flex-row'>
            <Header />

            <div className='flex min-w-0 flex-1 flex-col'>
              <main className='flex-1 w-full max-w-full overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8'>
                <Routes>
                  <Route path='/login' element={<Login />} />
                  <Route path='/about' element={<About />} />
                  <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path='/generate' element={<PrivateRoute><ReportGenerator /></PrivateRoute>} />
                  <Route path='/history' element={<PrivateRoute><ReportHistory /></PrivateRoute>} />
                  <Route path='/settings' element={<PrivateRoute><LabSettings /></PrivateRoute>} />
                  <Route path='/admin' element={<PrivateRoute roles={['master']}><AdminPanel /></PrivateRoute>} />
                  <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
