// ============================================================
// services/review.service.js
// ============================================================
// РУС: Бизнес-логика для отзывов.
// ESP: Lógica de negocio para reseñas.
// ============================================================

import Review from '../models/review.model.js';
import { notifyNewReview } from '../utils/email.js';

// Создать отзыв (userId опционален)
export const createReview = async ({ userId, nombre, texto, estrellas, telefono }) => {
  const review = await Review.create({
    user: userId || undefined,
    nombre,
    texto,
    estrellas,
    telefono: telefono || ''
  });

  // Enviar email al admin (no bloquea la respuesta al cliente)
  notifyNewReview(review).catch(() => {});

  return review;
};

// Получить одобренные отзывы (для публичного показа)
export const getApprovedReviews = async () => {
  return await Review
    .find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(20);
};

// Получить ВСЕ отзывы (для admin)
export const getAllReviews = async () => {
  return await Review
    .find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

// Обновить статус отзыва (admin)
export const updateReviewStatus = async (reviewId, status) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { status },
    { new: true }
  );
  if (!review) {
    throw { status: 404, message: 'Reseña no encontrada' };
  }
  return review;
};