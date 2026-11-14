import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor për dërgimin e JWT Token në çdo kërkesë
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartcampus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor për menaxhimin e përgjigjeve dhe gabimeve (p.sh. skadimi i sesionit)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('smartcampus_token');
        localStorage.removeItem('smartcampus_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Shërbimet e API-së sipas moduleve

// 1. Autentikimi
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
  updateUserRole: (id, role) => api.put(`/auth/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.put(`/auth/users/${id}/status`)
};

// 2. Njoftimet
export const announcementsService = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
  markAsRead: (id) => api.put(`/announcements/${id}/read`),
  delete: (id) => api.delete(`/announcements/${id}`)
};

// 3. Oraret
export const schedulesService = {
  getAll: (params) => api.get('/schedules', { params }),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`)
};

// 4. Detyrat
export const assignmentsService = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post('/assignments', data),
  delete: (id) => api.delete(`/assignments/${id}`)
};

// 5. Dorëzimet
export const submissionsService = {
  getMySubmissions: () => api.get('/submissions/my'),
  submit: (assignmentId, formData) => api.post(`/submissions/${assignmentId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  grade: (id, data) => api.put(`/submissions/${id}/grade`, data)
};

// 6. Sallat
export const roomsService = {
  getAll: () => api.get('/rooms'),
  create: (data) => api.post('/rooms', data)
};

// 7. Rezervimet
export const bookingsService = {
  getAll: (params) => api.get('/bookings', { params }),
  create: (data) => api.post('/bookings', data),
  approve: (id) => api.put(`/bookings/${id}/approve`),
  reject: (id) => api.put(`/bookings/${id}/reject`)
};

// 8. Statistikat
export const statsService = {
  getStats: () => api.get('/stats')
};

export default api;

