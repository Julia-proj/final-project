// ============================================================
// routes/review.routes.js
// ============================================================
// РУС: Маршруты для отзывов.
//   GET  /api/reviews          → публичный (одобренные)
//   POST /api/reviews          → требуется авторизация
// ESP: Rutas de reseñas. GET público, POST requiere token.
// ============================================================

import { Router } from 'express';
import { create, approved } from '../controllers/review.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Публичный — без авторизации
router.get('/', approved);

// Защищённый — требуется логин
router.post('/', authMiddleware, create);

export default router;