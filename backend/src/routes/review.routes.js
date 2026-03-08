// ============================================================
// routes/review.routes.js — Rutas de reseñas
// ============================================================
// Ambas rutas son públicas: cualquier visitante puede ver
// las reseñas aprobadas y enviar una nueva.
//
//   GET  /api/reviews → reseñas aprobadas (público)
//   POST /api/reviews → enviar reseña (público, nombre + teléfono)
// ============================================================

import { Router } from 'express';
import { create, approved } from '../controllers/review.controller.js';

const router = Router();

router.get('/', approved);
router.post('/', create);

export default router;