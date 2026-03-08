// ============================================================
// controllers/reservation.controller.js — Controlador de solicitudes
// ============================================================
// Gestiona solicitudes de servicios, formaciones, kits y productos.
// Incluye una ruta pública (sin login) y otra autenticada.
// ============================================================

import { createReservation, getUserReservations, createPublicReservation } from '../services/reservation.service.js';

// Solicitud autenticada — el userId viene del token
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

// Solicitud pública — no requiere login
export const createPublic = async (req, res, next) => {
  try {
    const reservation = await createPublicReservation({
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

// Mis solicitudes — devuelve las del usuario autenticado
export const myReservations = async (req, res, next) => {
  try {
    const reservations = await getUserReservations(req.user.id);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};