import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import { authAPI } from '../utils/api';
import { Card, Button, Input, Alert, Loading } from '../components/UIComponents';

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
    <div className='max-w-md mx-auto'>
      <Card>
        <h1 className='text-3xl font-bold mb-4'>Lab Technician Login</h1>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>Secure access to your report dashboard and lab settings.</p>
        {error && <Alert type='error' message={error} />}
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            label='Username'
            placeholder='Enter username'
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
          <Button type='submit' variant='primary' size='lg' disabled={loading}>
            {loading ? <Loading /> : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
