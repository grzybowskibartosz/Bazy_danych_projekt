// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Adres bazowy dla żądań API
});

export default api;
