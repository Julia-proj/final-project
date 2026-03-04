// ============================================================
// controllers/reservation.controller.js
// ============================================================
// РУС: Контроллер резерваций. Универсальный для всех типов.
// ESP: Controlador de reservaciones (servicios, formaciones, kit).
// ============================================================

import { createReservation, getUserReservations } from '../services/reservation.service.js';

// POST /api/reservations — создать резервацию (требуется авторизация)
export const create = async (req, res, next) => {
  try {
    const reservation = await createReservation({
      userId: req.user.id,
      type: req.body.type,
      nombre: req.body.nombre,
      telefono: req.body.telefono,
      detalle: req.body.detalle,
      notas: req.body.notas
    });
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

// GET /api/reservations/my — мои резервации
export const myReservations = async (req, res, next) => {
  try {
    const reservations = await getUserReservations(req.user.id);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};