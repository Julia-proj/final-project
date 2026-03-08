// ============================================================
// middlewares/auth.middleware.js — Middleware de autenticación
// ============================================================
// Se ejecuta ANTES de cualquier endpoint protegido.
// Extrae el token JWT del header Authorization, lo verifica
// y guarda los datos del usuario en req.user.
// ============================================================

import { verifyToken } from '../utils/token.js';

export const authMiddleware = (req, res, next) => {

  // Buscamos el header "Authorization: Bearer eyJhbGci..."
  const authHeader = req.headers.authorization;

  // Si no hay header o no tiene formato Bearer, rechazamos
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extraemos solo el token (quitamos "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Verificamos el token y obtenemos el payload (id, role)
    const decoded = verifyToken(token);
    req.user = decoded;  // guardamos en req para los controladores
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};