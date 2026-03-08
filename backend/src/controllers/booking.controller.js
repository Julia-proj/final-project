// ============================================================
// controllers/booking.controller.js — Controlador de citas
// ============================================================
// Gestiona la creación de citas y la consulta de citas
// del usuario autenticado.
// ============================================================

import { createBooking, getUserBookings } from '../services/booking.service.js';

export const create = async (req, res, next) => {
  try {
    // req.user.id viene del authMiddleware (token decodificado)
    const booking = await createBooking({
      userId: req.user.id,
      ...req.body
    });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const myBookings = async (req, res, next) => {
  try {
    const bookings = await getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};