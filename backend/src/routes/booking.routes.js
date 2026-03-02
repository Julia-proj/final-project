import { Router } from 'express';
import { create, myBookings } from '../controllers/booking.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// router.use aplica el middleware a TODAS las rutas de este archivo
// = toda esta sección requiere estar autenticado (tener token)
router.use(authMiddleware);                              // 📦 FÓRMULA

// POST /api/bookings — crear reserva
router.post('/', create);

// GET /api/bookings/my — mis reservas
router.get('/my', myBookings);

export default router;