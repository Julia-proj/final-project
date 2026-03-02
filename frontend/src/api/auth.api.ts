// ============================================================
// api/auth.api.ts
// ============================================================
// РУС: Функции для запросов к /api/auth/*
//      Каждая функция = один роут из backend/src/routes/auth.routes.js
// ESP: Funciones que llaman a los endpoints del backend de autenticación.
//
// МАППИНГ С БЭКОМ:
//   POST /api/auth/register → registerAPI()
//   POST /api/auth/login    → loginAPI()
//   GET  /api/auth/me       → getMeAPI()
// ============================================================

import axiosInstance from './axiosInstance';      // наш настроенный Axios
import type { LoginForm, RegisterForm } from '../types'; // TypeScript типы

// ── REGISTER ─────────────────────────────────────────────────
// РУС: Отправляем { name, email, password } на бэк
//      Бэк: auth.service.js → registerUser()
//      Бэк хэширует пароль (bcrypt), создаёт User в MongoDB, возвращает token + user
// ESP: Envía datos de registro. Backend crea usuario y devuelve token.
//
// 📦 ФОРМУЛА: axiosInstance.post(url, data)
// data = тело запроса (body)
// Возвращает Promise с ответом { data: { token, user } }

export const registerAPI = (data: RegisterForm) =>
  axiosInstance.post('/auth/register', data);

// ── LOGIN ────────────────────────────────────────────────────
// РУС: Отправляем { email, password }
//      Бэк: проверяет bcrypt, генерирует JWT, возвращает token + user
// ESP: Envía credenciales. Backend verifica y devuelve token.

export const loginAPI = (data: LoginForm) =>
  axiosInstance.post('/auth/login', data);

// ── GET ME ───────────────────────────────────────────────────
// РУС: GET запрос — тело не нужно, только токен (interceptor добавит сам)
//      Бэк: authMiddleware проверяет токен, возвращает данные пользователя
//      Используется при перезагрузке страницы — восстанавливаем сессию
// ESP: Obtiene datos del usuario actual. Útil al recargar la página.

export const getMeAPI = () =>
  axiosInstance.get('/auth/me');