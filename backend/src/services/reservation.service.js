// ============================================================
// services/reservation.service.js
// ============================================================
// РУС: Бизнес-логика для резерваций (servicios, formaciones, kit).
// ESP: Lógica de negocio para reservaciones.
// ============================================================

import Reservation from '../models/reservation.model.js';

// Создать резервацию
export const createReservation = async ({ userId, type, nombre, telefono, detalle, notas }) => {
  const reservation = await Reservation.create({
    user: userId,
    type,
    nombre,
    telefono,
    detalle,
    notas
  });
  return reservation;
};

// Мои резервации
export const getUserReservations = async (userId) => {
  return await Reservation
    .find({ user: userId })
    .sort({ createdAt: -1 });
};

// Все резервации (admin) — с фильтром по типу
export const getAllReservations = async (type) => {
  const filter = type ? { type } : {};
  return await Reservation
    .find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

// Обновить статус (admin)
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