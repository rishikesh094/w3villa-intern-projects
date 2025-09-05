import axios from 'axios';

const API_BASE_URL = 'http://localhost:4040/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
