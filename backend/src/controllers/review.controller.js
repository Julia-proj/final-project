// ============================================================
// controllers/review.controller.js — Controlador de reseñas
// ============================================================
// Permite crear reseñas (público, sin login obligatorio)
// y obtener las reseñas aprobadas para mostrar en la web.
// ============================================================

import { createReview, getApprovedReviews } from '../services/review.service.js';

// Crear reseña — el userId es opcional (puede ser anónimo)
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

// Obtener reseñas aprobadas — endpoint público
export const approved = async (req, res, next) => {
  try {
    const reviews = await getApprovedReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};