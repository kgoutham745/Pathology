import axios from 'axios';

// Use different base URLs for development and production
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? 'http://localhost:5000/api' : '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Authentication API
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
};

// Reports API
export const reportAPI = {
  create: (data) => API.post('/reports', data),
  getAll: () => API.get('/reports'),
  getById: (id) => API.get(`/reports/${id}`),
  getByReportId: (reportId) => API.get(`/reports/report/${reportId}`),
  getPatientReports: (patientId) => API.get(`/reports/patient/${patientId}`),
  search: (query) => API.get('/reports/search', { params: { query } }),
  update: (id, data) => API.put(`/reports/${id}`, data),
  delete: (id) => API.delete(`/reports/${id}`),
};

// Patients API
export const patientAPI = {
  create: (data) => API.post('/patients', data),
  getAll: () => API.get('/patients'),
  getById: (id) => API.get(`/patients/${id}`),
  search: (query) => API.get('/patients/search', { params: { query } }),
  update: (id, data) => API.put(`/patients/${id}`, data),
  delete: (id) => API.delete(`/patients/${id}`),
};

// Tests API
export const testAPI = {
  getAll: () => API.get('/tests'),
  getById: (id) => API.get(`/tests/${id}`),
  getByTestId: (testId) => API.get(`/tests/code/${testId}`),
  create: (data) => API.post('/tests', data),
  update: (id, data) => API.put(`/tests/${id}`, data),
  delete: (id) => API.delete(`/tests/${id}`),
};

// Lab Settings API
export const labAPI = {
  getSettings: () => API.get('/lab/settings'),
  updateSettings: (data) => API.put('/lab/settings', data),
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return API.post('/lab/logo', formData);
  },
};

// Admin API
export const adminAPI = {
  getAccounts: () => API.get('/admin/accounts'),
  createAccount: (data) => API.post('/admin/accounts', data),
  updateAccount: (id, data) => API.put(`/admin/accounts/${id}`, data),
  deleteAccount: (id) => API.delete(`/admin/accounts/${id}`),
  toggleAccountStatus: (id, active) => API.patch(`/admin/accounts/${id}/status`, { active })
};

// Account API
export const accountAPI = {
  getMe: () => API.get('/account/me'),
};

export default API;
