// ============================================================
// api/reservations.api.ts — API de solicitudes
// ============================================================
// Llamadas a /api/reservations para crear solicitudes
// (autenticadas o públicas) y consultar las propias.
// ============================================================

import axiosInstance from './axiosInstance';
import type { ReservationForm } from '../types';

export const createReservationAPI = (data: ReservationForm) =>
  axiosInstance.post('/reservations', data);

export const createPublicReservationAPI = (data: ReservationForm) =>
  axiosInstance.post('/reservations/public', data);

export const getMyReservationsAPI = () =>
  axiosInstance.get('/reservations/my');