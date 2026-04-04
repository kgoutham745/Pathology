import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ReportGenerator from './pages/ReportGenerator';
import ReportHistory from './pages/ReportHistory';
import LabSettings from './pages/LabSettings';
import useThemeStore from './context/themeStore';

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
              <Route path='/' element={<Dashboard />} />
              <Route path='/generate' element={<ReportGenerator />} />
              <Route path='/history' element={<ReportHistory />} />
              <Route path='/settings' element={<LabSettings />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
