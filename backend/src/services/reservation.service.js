// ============================================================
// services/reservation.service.js — Lógica de solicitudes
// ============================================================
// Gestiona solicitudes de servicios, formaciones, kits y productos.
// Incluye envío de email al admin cuando se crea una nueva.
// ============================================================

import Reservation from '../models/reservation.model.js';
import { notifyNewReservation } from '../utils/email.js';

// Crear solicitud autenticada (con userId del token)
export const createReservation = async ({ userId, type, nombre, telefono, detalle, notas }) => {
  const reservation = await Reservation.create({
    user: userId,
    type,
    nombre,
    telefono,
    detalle,
    notas
  });

  // Enviar email de notificación al admin (no bloquea la respuesta)
  notifyNewReservation(reservation).catch(() => {});

  return reservation;
};

// Crear solicitud pública (sin usuario logueado)
export const createPublicReservation = async ({ type, nombre, telefono, detalle, notas }) => {
  if (!nombre || !telefono) {
    throw { status: 400, message: 'Nombre y teléfono son obligatorios.' };
  }
  const reservation = await Reservation.create({
    type,
    nombre,
    telefono,
    detalle,
    notas
  });

  // Enviar email de notificación al admin
  notifyNewReservation(reservation).catch(() => {});

  return reservation;
};

// Mis solicitudes (usuario autenticado)
export const getUserReservations = async (userId) => {
  return await Reservation
    .find({ user: userId })
    .sort({ createdAt: -1 });
};

// Todas las solicitudes (admin) — con filtro opcional por tipo
export const getAllReservations = async (type) => {
  const filter = type ? { type } : {};
  return await Reservation
    .find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

// Actualizar estado (admin)
export const updateReservationStatus = async (id, status) => {
  const reservation = await Reservation.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!reservation) {
    throw { status: 404, message: 'Reservación no encontrada' };
  }
  return reservation;
};