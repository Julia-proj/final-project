// ============================================================
// index.js — Punto de entrada del servidor Express
// ============================================================
// Archivo principal del backend. Aquí se configura Express,
// se conecta la base de datos y se montan todas las rutas.
//
// Rutas registradas:
//   /api/auth          → registro, login, datos del usuario
//   /api/bookings      → crear cita, ver mis citas
//   /api/reservations  → solicitudes (formaciones, kit, productos)
//   /api/reviews       → reseñas de clientes
//   /api/admin         → panel admin (gestión de todo)
//   /api/checkout      → pasarela de pago Stripe
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARES GLOBALES ─────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// ── CONECTAR BASE DE DATOS ───────────────────────────────────
connectDB();

// ── HEALTH CHECK ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Keratin Madrid API running!' });
});

// ── RUTAS ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/checkout', checkoutRoutes);

// ── MIDDLEWARE DE ERRORES (siempre al final) ─────────────────
app.use(errorHandler);

// ── ARRANCAR SERVIDOR ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});