// ============================================================
// routes/reservation.routes.js — Rutas de solicitudes
// ============================================================
// Gestiona solicitudes de servicios, formaciones, kits y productos.
// La ruta /public no requiere autenticación (permite pedir
// productos desde la landing sin estar logueado).
//
//   POST /api/reservations/public → solicitud pública (sin login)
//   POST /api/reservations        → solicitud autenticada
//   GET  /api/reservations/my     → mis solicitudes
// ============================================================

import { Router } from 'express';
import { create, myReservations, createPublic } from '../controllers/reservation.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta pública — no requiere login
router.post('/public', createPublic);

// A partir de aquí se requiere token
router.use(authMiddleware);

router.post('/', create);
router.get('/my', myReservations);

export default router;