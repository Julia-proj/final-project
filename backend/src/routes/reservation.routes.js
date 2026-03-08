// ============================================================
// routes/reservation.routes.js
// ============================================================
// РУС: Маршруты для резерваций.
//   POST /api/reservations     → создать (требуется авторизация)
//   GET  /api/reservations/my  → мои резервации
// ESP: Rutas de reservaciones. Requieren token.
// ============================================================

import { Router } from 'express';
import { create, myReservations, createPublic } from '../controllers/reservation.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Публичный — резервация продукта без логина
router.post('/public', createPublic);

// Защищённые — требуется авторизация
router.use(authMiddleware);

router.post('/', create);
router.get('/my', myReservations);

export default router;