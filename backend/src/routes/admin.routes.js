import { Router } from 'express';
import { allBookings, updateStatus } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Cadena de middlewares: primero verifica token, luego verifica rol admin
router.use(authMiddleware);            
router.use(requireRole('admin'));        

// GET /api/admin/bookings — todas las reservas
router.get('/bookings', allBookings);

// PATCH /api/admin/bookings/:id/status — cambiar status de una reserva
// :id es un parámetro dinámico — se accede con req.params.id
router.patch('/bookings/:id/status', updateStatus);

export default router;