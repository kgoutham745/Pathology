import create from 'zustand';
import { accountAPI } from '../utils/api';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const getInitialToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('authToken') || '';
};

const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem('authUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      return null;
    }
  }

  const token = localStorage.getItem('authToken');
  return token ? parseJwt(token) : null;
};

const useAuthStore = create((set) => ({
  token: getInitialToken(),
  user: getInitialUser(),
  isLoggedIn: !!getInitialToken(),
  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
    }
    set({ token, user, isLoggedIn: true });
  },
  refreshUser: async () => {
    if (typeof window === 'undefined') return;
    try {
      const response = await accountAPI.getMe();
      const refreshedUser = response.data;
      localStorage.setItem('authUser', JSON.stringify(refreshedUser));
      set({ user: refreshedUser });
    } catch (error) {
      console.error('Unable to refresh user account information:', error);
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    set({ token: '', user: null, isLoggedIn: false });
  },
}));

export default useAuthStore;
