// ============================================================
// index.js — Точка входа Express сервера
// ============================================================
// РУС: Главный файл бэкенда. Подключает все маршруты.
// ESP: Archivo principal del backend. Conecta todas las rutas.
//
// МАРШРУТЫ:
//   /api/auth          → register, login, me
//   /api/bookings      → crear reserva, mis reservas
//   /api/reservations  → formaciones, kit, servicios
//   /api/reviews       → отзывы
//   /api/admin         → panel admin (bookings + reservations + reviews)
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