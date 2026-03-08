// ============================================================
// api/reviews.api.ts — API de reseñas
// ============================================================
// Llamadas a /api/reviews para obtener reseñas aprobadas
// (público) y enviar nuevas reseñas.
// ============================================================

import axiosInstance from './axiosInstance';
import type { ReviewForm } from '../types';

export const getApprovedReviewsAPI = () =>
  axiosInstance.get('/reviews');

export const createReviewAPI = (data: ReviewForm) =>
  axiosInstance.post('/reviews', data);