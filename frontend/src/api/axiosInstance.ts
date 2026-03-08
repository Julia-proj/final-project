// ============================================================
// api/axiosInstance.ts — Instancia de Axios configurada
// ============================================================
// Crea una instancia de Axios con la baseURL del backend.
// Un interceptor añade automáticamente el token JWT en el
// header Authorization de cada petición.
// ============================================================

import axios from 'axios';

// La URL base apunta al backend (variable de entorno en Vercel / local)
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptor: antes de enviar cualquier petición, añade el token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Formato estándar HTTP: "Bearer <token>"
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;