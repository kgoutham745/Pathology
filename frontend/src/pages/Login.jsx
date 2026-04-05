import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import { authAPI } from '../utils/api';
import { Card, Button, Input, Alert } from '../components/UIComponents';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, from, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      login(response.data.token, response.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-[80vh] items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
      <div className='hidden rounded-[32px] bg-[linear-gradient(135deg,rgba(76,29,149,0.98),rgba(67,56,202,0.94),rgba(236,72,153,0.82))] p-10 text-white shadow-[0_30px_70px_rgba(76,29,149,0.24)] lg:block'>
        <img src='/pathora-logo.svg' alt='Pathora Labs logo' className='h-20 w-20 rounded-[28px]' />
        <p className='mt-6 w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]'>Pathora Labs</p>
        <h1 className='mt-8 max-w-xl text-5xl font-bold leading-tight'>Clinical reporting built for fast, professional lab workflows.</h1>
        <p className='mt-6 max-w-lg text-base text-violet-50/90'>Generate polished PDFs, manage lab operations, and keep every report workflow inside one modern pathology workspace.</p>
      </div>

      <Card className='mx-auto w-full max-w-lg p-8'>
        <h1 className='mb-4 text-3xl font-bold'>Sign In to Pathora Labs</h1>
        <p className='mb-6 text-slate-600'>Secure access to reports, patient history, and lab settings.</p>
        {error && <Alert type='error' message={error} />}
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            label='Username'
            placeholder='Admin username or technician email'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label='Password'
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type='submit' variant='primary' size='lg' disabled={loading} className='w-full'>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
