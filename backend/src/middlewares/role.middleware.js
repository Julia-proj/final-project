// ============================================================
// middlewares/role.middleware.js — Middleware de autorización por rol
// ============================================================
// Función fábrica que devuelve un middleware. Comprueba si
// el usuario (ya verificado por authMiddleware) tiene el rol
// requerido. Se usa así: requireRole('admin').
// ============================================================

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: 'Acceso denegado. Permisos insuficientes.'
      });
    }
    next();
  };
};