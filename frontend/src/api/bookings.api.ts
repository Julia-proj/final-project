// ============================================================
// api/bookings.api.ts
// ============================================================
// РУС: Запросы к /api/bookings и /api/admin/*
// ESP: Llamadas a endpoints de reservas y administración.
// ============================================================

import axiosInstance from './axiosInstance';
import type { BookingForm } from '../types';

// ── BOOKINGS (пользователь) ──────────────────────────────────

export const createBookingAPI = (data: BookingForm) =>
  axiosInstance.post('/bookings', data);

export const getMyBookingsAPI = () =>
  axiosInstance.get('/bookings/my');

// ── ADMIN: BOOKINGS ──────────────────────────────────────────

export const getAllBookingsAPI = () =>
  axiosInstance.get('/admin/bookings');

export const updateBookingStatusAPI = (id: string, status: string) =>
  axiosInstance.patch(`/admin/bookings/${id}/status`, { status });

// ── ADMIN: RESERVATIONS ──────────────────────────────────────

export const getAllReservationsAPI = (type?: string) =>
  axiosInstance.get('/admin/reservations', { params: type ? { type } : {} });

export const updateReservationStatusAPI = (id: string, status: string) =>
  axiosInstance.patch(`/admin/reservations/${id}/status`, { status });

// ── ADMIN: REVIEWS ───────────────────────────────────────────

export const getAllReviewsAPI = () =>
  axiosInstance.get('/admin/reviews');

export const updateReviewStatusAPI = (id: string, status: string) =>
  axiosInstance.patch(`/admin/reviews/${id}/status`, { status });