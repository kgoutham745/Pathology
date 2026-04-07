import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Home, FileText, Clock, Settings, ShieldCheck, FlaskConical, Info, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../context/authStore';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => !!state.token);
  const user = useAuthStore((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  const menuItems = isLoggedIn
    ? [
        { label: 'Dashboard', path: '/', icon: Home },
        { label: 'Generate', path: '/generate', icon: FileText },
        { label: 'Reports', path: '/history', icon: Clock },
        { label: 'Lab Settings', path: '/settings', icon: Settings },
        { label: 'About', path: '/about', icon: Info },
        ...(user?.role === 'master' ? [{ label: 'Admin', path: '/admin', icon: ShieldCheck }] : [])
      ]
    : [
        { label: 'About', path: '/about', icon: Info },
        { label: 'Login', path: '/login', icon: Home }
      ];

  const getNavItemClass = (path) => (
    `w-full rounded-2xl px-4 py-3 text-left transition flex items-center gap-3 text-sm font-medium ${
      location.pathname === path
        ? 'bg-white text-slate-900 shadow-[0_12px_24px_rgba(15,39,64,0.14)]'
        : 'text-slate-200/88 hover:bg-white/12 hover:text-white'
    }`
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const UserMeta = () => (
    <div className='rounded-3xl border border-white/10 bg-white/10 p-4 text-white/90'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15'>
          {user?.role === 'master' ? <ShieldCheck size={18} /> : <FlaskConical size={18} />}
        </div>
        <div>
          <p className='text-sm font-semibold'>{user?.name || user?.username || 'Pathora Labs'}</p>
          <p className='text-xs text-slate-300'>{user?.role === 'master' ? 'Control workspace' : 'Lab operations workspace'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.header
        className='sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur md:hidden'
        initial={{ y: -60 }}
        animate={{ y: 0 }}
      >
        <div className='flex items-center justify-between px-4 py-3'>
          <button className='flex items-center gap-3' onClick={() => navigate('/')}>
            <img src='/pathora-logo.svg' alt='Pathora Labs logo' className='h-11 w-11 rounded-2xl shadow-lg' />
            <div className='text-left'>
              <h1 className='text-base font-bold text-slate-900'>Pathora Labs</h1>
              <p className='text-xs text-slate-500'>Smart pathology workspace</p>
            </div>
          </button>

          <div className='flex items-center gap-2'>
            {isLoggedIn && (
              <button onClick={handleLogout} className='rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800' aria-label='Logout'>
                <LogOut size={18} />
              </button>
            )}
            <button onClick={() => setMenuOpen((value) => !value)} className='rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800' aria-label='Toggle navigation menu'>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      </motion.header>

      {menuOpen && (
        <div className='fixed inset-0 z-50 md:hidden'>
          <motion.button
            type='button'
            aria-label='Close navigation menu'
            className='absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />

          <motion.aside
            className='absolute right-0 top-0 flex h-full w-full max-w-full flex-col bg-[linear-gradient(180deg,#4c1d95_0%,#312e81_55%,#1e1b4b_100%)] px-4 pb-5 pt-4 text-white shadow-[-18px_0_45px_rgba(15,23,42,0.28)] sm:w-[min(82vw,20rem)]'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <div className='flex items-center justify-between gap-3'>
              <button className='flex min-w-0 items-center gap-3 text-left' onClick={() => navigate('/')}>
                <img src='/pathora-logo.svg' alt='Pathora Labs logo' className='h-11 w-11 rounded-2xl shadow-lg' />
                <div className='min-w-0'>
                  <h2 className='truncate text-base font-bold text-white'>Pathora Labs</h2>
                  <p className='truncate text-xs text-violet-100/80'>Smart pathology workspace</p>
                </div>
              </button>

              <button
                onClick={() => setMenuOpen(false)}
                className='rounded-xl p-2 text-violet-100 transition hover:bg-white/10 hover:text-white'
                aria-label='Close navigation menu'
              >
                <X size={20} />
              </button>
            </div>

            <div className='mt-5'>
              {isLoggedIn && <UserMeta />}
            </div>

            <nav className='mt-5 flex-1 space-y-2 overflow-y-auto pb-4'>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      location.pathname === item.path
                        ? 'bg-white text-slate-900 shadow-[0_12px_24px_rgba(15,39,64,0.14)]'
                        : 'bg-white/8 text-slate-100 hover:bg-white/14'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className='mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-white/12 px-4 py-3 font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/18'
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </motion.aside>
        </div>
      )}

      <aside className='hidden min-h-screen w-80 shrink-0 flex-col bg-[linear-gradient(180deg,#4c1d95_0%,#312e81_55%,#1e1b4b_100%)] px-5 py-6 text-white md:flex'>
        <button className='flex items-center gap-4 rounded-[28px] bg-white/10 px-5 py-5 text-left' onClick={() => navigate('/')}>
          <img src='/pathora-logo.svg' alt='Pathora Labs logo' className='h-14 w-14 rounded-3xl shadow-xl' />
          <div>
            <h1 className='text-xl font-bold tracking-tight'>Pathora Labs</h1>
            <p className='text-sm text-slate-300'>Professional pathology workspace</p>
          </div>
        </button>

        <div className='mt-6'>
          {isLoggedIn && <UserMeta />}
        </div>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/12 px-4 py-3 font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/18'
          >
            <LogOut size={18} />
            Logout
          </button>
        )}

        <nav className='mt-6 flex-1 space-y-2'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className={getNavItemClass(item.path)}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className='rounded-3xl border border-white/10 bg-white/8 p-4 text-sm text-violet-100/85'>
          <div className='mb-2 flex items-center gap-2 font-semibold text-white'>
            <Sparkles size={16} />
            Precision Reporting
          </div>
          Clean diagnostics, faster handoff, and a better report experience for labs and clinicians.
        </div>
      </aside>
    </>
  );
};

export default Header;
