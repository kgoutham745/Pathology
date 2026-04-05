import create from 'zustand';

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
  const token = localStorage.getItem('authToken');
  return token ? parseJwt(token) : null;
};

const useAuthStore = create((set) => ({
  token: getInitialToken(),
  user: getInitialUser(),
  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    set({ token: '', user: null });
  },
  isLoggedIn: false,
}));

export default useAuthStore;
