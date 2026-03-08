// ============================================================
// services/review.service.js — Lógica de reseñas
// ============================================================
// Gestiona la creación de reseñas, consulta de aprobadas
// y moderación por parte del admin. Envía email de notificación.
// ============================================================

import Review from '../models/review.model.js';
import { notifyNewReview } from '../utils/email.js';

// Crear reseña (el userId es opcional — puede ser anónima)
export const createReview = async ({ userId, nombre, texto, estrellas, telefono }) => {
  const review = await Review.create({
    user: userId || undefined,
    nombre,
    texto,
    estrellas,
    telefono: telefono || ''
  });

  // Enviar email de notificación al admin (no bloquea la respuesta)
  notifyNewReview(review).catch(() => {});

  return review;
};

// Obtener reseñas aprobadas (para mostrar en la web)
export const getApprovedReviews = async () => {
  return await Review
    .find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(20);
};

// Obtener TODAS las reseñas (para el panel admin)
export const getAllReviews = async () => {
  return await Review
    .find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

// Actualizar estado de la reseña (admin: aprobar u ocultar)
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