// ============================================================
// api/bookings.api.ts
// ============================================================
// РУС: Запросы к /api/bookings/*
//      Эти роуты ЗАЩИЩЕНЫ — бэк проверяет JWT токен (router.use(authMiddleware))
//      Интерсептор автоматически добавит токен → всё работает само
// ESP: Llamadas a los endpoints de reservas. Requieren token (se añade automáticamente).
// ============================================================

import axiosInstance from './axiosInstance';
import type { BookingForm } from '../types';

// POST /api/bookings — crear reserva
// Бэк: booking.controller.js → createBooking() → BookingModel.create()
export const createBookingAPI = (data: BookingForm) =>
  axiosInstance.post('/bookings', data);

// GET /api/bookings/my — mis reservas
// Бэк: возвращает только бронирования ТЕКУЩЕГО пользователя (из токена берёт userId)
export const getMyBookingsAPI = () =>
  axiosInstance.get('/bookings/my');


// ============================================================
// api/admin.api.ts (в том же файле для краткости, можно разделить)
// ============================================================
// РУС: Запросы к /api/admin/* — только для роли 'admin'
//      Бэк проверяет: authMiddleware + requireRole('admin')
// ESP: Solo accesible para admins. Backend verifica rol.
// ============================================================

// GET /api/admin/bookings — TODAS las reservas con datos del usuario
export const getAllBookingsAPI = () =>
  axiosInstance.get('/admin/bookings');

// PATCH /api/admin/bookings/:id/status — cambiar estado de reserva
// :id = динамический параметр (template literal `${id}`)
// body: { status: 'confirmed' | 'cancelled' }
export const updateBookingStatusAPI = (id: string, status: string) =>
  axiosInstance.patch(`/admin/bookings/${id}/status`, { status });