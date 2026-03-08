// ============================================================
// routes/auth.routes.js — Rutas de autenticación
// ============================================================
// Define los endpoints públicos de registro y login,
// y el endpoint protegido /me que devuelve el usuario actual.
//
//   POST /api/auth/register  → crear cuenta
//   POST /api/auth/login     → iniciar sesión
//   GET  /api/auth/me        → obtener usuario (requiere token)
// ============================================================

import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// /me requiere token para identificar al usuario
router.get('/me', authMiddleware, me);

export default router;