// ============================================================
// utils/token.js — Generación y verificación de JWT
// ============================================================
// generateToken: crea un token firmado con la clave secreta.
// verifyToken: verifica que el token sea válido y no haya expirado.
// El token expira en 7 días.
// ============================================================

import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(
    payload,                    // datos a incluir (id, role)
    process.env.JWT_SECRET,    // clave secreta del .env
    { expiresIn: '7d' }        // expira en 7 días
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};