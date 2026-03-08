// ============================================================
// api/reservations.api.ts
// ============================================================
// РУС: Запросы к /api/reservations
// ESP: Llamadas al endpoint de reservaciones.
//
// МАППИНГ:
//   POST /api/reservations    → createReservationAPI()
//   GET  /api/reservations/my → getMyReservationsAPI()
// ============================================================

import axiosInstance from './axiosInstance';
import type { ReservationForm } from '../types';

export const createReservationAPI = (data: ReservationForm) =>
  axiosInstance.post('/reservations', data);

export const createPublicReservationAPI = (data: ReservationForm) =>
  axiosInstance.post('/reservations/public', data);

export const getMyReservationsAPI = () =>
  axiosInstance.get('/reservations/my');