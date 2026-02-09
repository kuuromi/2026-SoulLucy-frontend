import axios from 'axios';

const API_URL = 'https://localhost:7155/api'; 
const api = axios.create({ baseURL: API_URL });

export const bookingService = {
  getAll: () => api.get('/BookingsApi'),
  getRooms: () => api.get('/Rooms'),
  create: (data: any) => api.post('/BookingsApi', data),
  update: (id: number, data: any) => api.put(`/BookingsApi/${id}`, data),
  updateStatus: (id: number, data: any) => api.put(`/BookingsApi/${id}/status`, data),
  delete: (id: number) => api.delete(`/BookingsApi/${id}`),
};

export default api;