// ============================================================
// controllers/review.controller.js
// ============================================================
// РУС: Контроллер отзывов. Принимает req → вызывает service → отдаёт res.
// ESP: Controlador de reseñas.
// ============================================================

import { createReview, getApprovedReviews } from '../services/review.service.js';

// POST /api/reviews — создать отзыв (публичный, без авторизации)
export const create = async (req, res, next) => {
  try {
    const review = await createReview({
      userId: req.user?.id || null,
      nombre: req.body.nombre,
      texto: req.body.texto,
      estrellas: req.body.estrellas,
      telefono: req.body.telefono
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews — получить одобренные отзывы (публичный)
export const approved = async (req, res, next) => {
  try {
    const reviews = await getApprovedReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};