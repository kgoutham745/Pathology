import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../context/themeStore';
import useAuthStore from '../context/authStore';

const Header = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => !!state.token);
  const user = useAuthStore((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    initTheme();
  }, []);

  const menuItems = isLoggedIn
    ? [
        { label: 'Dashboard', path: '/' },
        { label: 'Generate Report', path: '/generate' },
        { label: 'Report History', path: '/history' },
        { label: 'Lab Settings', path: '/settings' },
        ...(user?.role === 'master' ? [{ label: 'Admin', path: '/admin' }] : [])
      ]
    : [{ label: 'Login', path: '/login' }];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      className='bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg text-white sticky top-0 z-40'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='max-w-7xl mx-auto px-4 py-4 flex justify-between items-center'>
        {/* Logo */}
        <motion.div
          className='flex items-center gap-2 cursor-pointer'
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
        >
          <div className='text-2xl font-bold'>🧪</div>
          <div>
            <h1 className='text-2xl font-bold'>Pathology Report</h1>
            <p className='text-xs opacity-90'>Medical Lab System</p>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center gap-6'>
          {menuItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className='hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors'
              whileHover={{ scale: 1.05 }}
            >
              {item.label}
            </motion.button>
          ))}
          {isLoggedIn && (
            <motion.button
              onClick={handleLogout}
              className='flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'
              whileHover={{ scale: 1.05 }}
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          )}
        </div>

        {/* Theme Toggle & Mobile Menu */}
        <div className='flex items-center gap-3'>
          <motion.button
            onClick={toggleTheme}
            className='p-2 hover:bg-blue-500 rounded-lg'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='md:hidden p-2 hover:bg-blue-500 rounded-lg'
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className='md:hidden bg-blue-700 px-4 py-3 space-y-2'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {menuItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              className='block w-full text-left px-4 py-2 hover:bg-blue-600 rounded-lg'
              whileHover={{ x: 10 }}
            >
              {item.label}
            </motion.button>
          ))}
          {isLoggedIn && (
            <motion.button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className='block w-full text-left px-4 py-2 hover:bg-blue-600 rounded-lg'
              whileHover={{ x: 10 }}
            >
              Logout
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
