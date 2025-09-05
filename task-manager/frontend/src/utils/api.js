import axios from 'axios';

const API_BASE_URL = 'https://task-manager-backend-2bmv.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
