// ============================================================
// routes/admin.routes.js — Rutas del panel de administración
// ============================================================
// Todas las rutas requieren token + rol admin.
// Se aplican dos middlewares globales: authMiddleware y requireRole.
//
// Endpoints:
//   GET    /api/admin/bookings              → todas las citas
//   PATCH  /api/admin/bookings/:id/status   → cambiar estado
//   GET    /api/admin/reservations          → todas las solicitudes
//   PATCH  /api/admin/reservations/:id/status → cambiar estado
//   GET    /api/admin/reviews               → todas las reseñas
//   PATCH  /api/admin/reviews/:id/status    → cambiar estado
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

// Middlewares globales: primero verificar token, luego verificar rol admin
router.use(authMiddleware);
router.use(requireRole('admin'));

// Citas
router.get('/bookings', allBookings);
router.patch('/bookings/:id/status', updateStatus);

// Solicitudes (formaciones, kit, productos, servicios)
router.get('/reservations', allReservations);
router.patch('/reservations/:id/status', updateReservation);

// Reseñas
router.get('/reviews', allReviews);
router.patch('/reviews/:id/status', updateReview);

export default router;