// ============================================================
// middlewares/error.middleware.js — Manejador global de errores
// ============================================================
// Captura cualquier error que llegue con next(error).
// En desarrollo muestra el stack trace; en producción solo
// el mensaje para no exponer detalles internos.
// ============================================================

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = { message };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(status).json(response);
};