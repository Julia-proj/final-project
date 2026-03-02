import { verifyToken } from '../utils/token.js';  

// Esta función se ejecuta ANTES de cualquier endpoint protegido
export const authMiddleware = (req, res, next) => {  

  // Buscamos el header "Authorization: Bearer eyJhbGci..."
  const authHeader = req.headers.authorization;     // 📦 FÓRMULA

  // Si no hay header o no empieza con "Bearer ", rechazamos
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extraemos solo el token (quitamos "Bearer ")
  const token = authHeader.split(' ')[1];           // 📦 FÓRMULA

  try {
    const decoded = verifyToken(token); // decoded = verified payload del token.js
    req.user = decoded;  // 🎨 — guardamos el usuario en req para usarlo después
    next();              
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};