import { Router } from 'express';                           // 📦 FÓRMULA
import { register, login, me } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();                                    // 📦 FÓRMULA

router.post('/register', register);
router.post('/login', login);

// AÑADIR — requiere token para saber quién soy
router.get('/me', authMiddleware, me);

export default router;