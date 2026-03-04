// ============================================================
// routes/admin.routes.js
// ============================================================
// РУС: Маршруты админа. ВСЕ требуют авторизацию + роль admin.
// ESP: Rutas admin. Todas requieren token + rol admin.
//
// МАРШРУТЫ:
//   GET    /api/admin/bookings              → все бронирования
//   PATCH  /api/admin/bookings/:id/status   → сменить статус
//   GET    /api/admin/reservations          → все резервации (?type=formacion)
//   PATCH  /api/admin/reservations/:id/status → сменить статус
//   GET    /api/admin/reviews               → все отзывы
//   PATCH  /api/admin/reviews/:id/status    → сменить статус
// ============================================================

import { Router } from 'express';
import {
  allBookings, updateStatus,
  allReservations, updateReservation,
  allReviews, updateReview
} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Цепочка middleware: сначала проверяем токен, потом роль admin
router.use(authMiddleware);
router.use(requireRole('admin'));

// ── Bookings (записи на услуги) ──
router.get('/bookings', allBookings);
router.patch('/bookings/:id/status', updateStatus);

// ── Reservations (formaciones, kit, servicios) ──
router.get('/reservations', allReservations);
router.patch('/reservations/:id/status', updateReservation);

// ── Reviews (отзывы) ──
router.get('/reviews', allReviews);
router.patch('/reviews/:id/status', updateReview);

export default router;