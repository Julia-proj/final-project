// ============================================================
// api/bookings.api.ts — API de citas y panel admin
// ============================================================
// Contiene las llamadas para citas del usuario y para las
// funciones de administración (citas, solicitudes, reseñas).
// ============================================================

import axiosInstance from './axiosInstance';
import type { BookingForm } from '../types';

// ── CITAS (usuario) ──────────────────────────────────

export const createBookingAPI = (data: BookingForm) =>
  axiosInstance.post('/bookings', data);

export const getMyBookingsAPI = () =>
  axiosInstance.get('/bookings/my');

// ── ADMIN: CITAS ────────────────────────────────────────────

export const getAllBookingsAPI = () =>
  axiosInstance.get('/admin/bookings');

export const updateBookingStatusAPI = (id: string, status: string) =>
  axiosInstance.patch(`/admin/bookings/${id}/status`, { status });

// ── ADMIN: SOLICITUDES ───────────────────────────────────────

export const getAllReservationsAPI = (type?: string) =>
  axiosInstance.get('/admin/reservations', { params: type ? { type } : {} });

export const updateReservationStatusAPI = (id: string, status: string) =>
  axiosInstance.patch(`/admin/reservations/${id}/status`, { status });

// ── ADMIN: RESEÑAS ───────────────────────────────────────────

export const getAllReviewsAPI = () =>
  axiosInstance.get('/admin/reviews');

export const updateReviewStatusAPI = (id: string, status: string) =>
  axiosInstance.patch(`/admin/reviews/${id}/status`, { status });