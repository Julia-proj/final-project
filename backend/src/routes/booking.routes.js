// ============================================================
// routes/booking.routes.js — Rutas de citas (bookings)
// ============================================================
// Todas las rutas de este archivo requieren autenticación.
// El authMiddleware se aplica globalmente con router.use().
//
//   POST /api/bookings    → crear nueva cita
//   GET  /api/bookings/my → ver mis citas
// ============================================================

import { Router } from 'express';
import { create, myBookings } from '../controllers/booking.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware global: todas las rutas debajo requieren token
router.use(authMiddleware);

router.post('/', create);
router.get('/my', myBookings);

export default router;