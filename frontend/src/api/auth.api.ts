// ============================================================
// api/auth.api.ts — Llamadas al backend de autenticación
// ============================================================
// Funciones que se comunican con /api/auth/*.
// Cada función corresponde a un endpoint del backend.
//
//   POST /api/auth/register → registerAPI()
//   POST /api/auth/login    → loginAPI()
//   GET  /api/auth/me       → getMeAPI()
// ============================================================

import axiosInstance from './axiosInstance';
import type { LoginForm, RegisterForm } from '../types';

export const registerAPI = (data: RegisterForm) =>
  axiosInstance.post('/auth/register', data);

export const loginAPI = (data: LoginForm) =>
  axiosInstance.post('/auth/login', data);

// No necesita body — el interceptor añade el token automáticamente
export const getMeAPI = () =>
  axiosInstance.get('/auth/me');