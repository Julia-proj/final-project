// ============================================================
// api/reviews.api.ts
// ============================================================
// РУС: Запросы к /api/reviews
// ESP: Llamadas al endpoint de reseñas.
//
// МАППИНГ:
//   GET  /api/reviews → getApprovedReviewsAPI()  (публичный)
//   POST /api/reviews → createReviewAPI()         (требуется токен)
// ============================================================

import axiosInstance from './axiosInstance';
import type { ReviewForm } from '../types';

export const getApprovedReviewsAPI = () =>
  axiosInstance.get('/reviews');

export const createReviewAPI = (data: ReviewForm) =>
  axiosInstance.post('/reviews', data);