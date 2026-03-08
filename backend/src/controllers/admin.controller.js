// ============================================================
// controllers/admin.controller.js — Controlador del panel admin
// ============================================================
// Permite al administrador ver y gestionar todas las citas,
// solicitudes y reseñas. Cada función delega en su service.
// ============================================================

import { getAllBookings, updateBookingStatus } from '../services/booking.service.js';
import { getAllReservations, updateReservationStatus } from '../services/reservation.service.js';
import { getAllReviews, updateReviewStatus } from '../services/review.service.js';

// ── CITAS ──────────────────────────────────────────────────

export const allBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const booking = await updateBookingStatus(req.params.id, req.body.status);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// ── SOLICITUDES (formaciones, kit, productos, servicios) ──────

export const allReservations = async (req, res, next) => {
  try {
  // Filtro opcional por tipo: ?type=formacion
    const type = req.query.type || null;
    const reservations = await getAllReservations(type);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

export const updateReservation = async (req, res, next) => {
  try {
    const reservation = await updateReservationStatus(req.params.id, req.body.status);
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

// ── RESEÑAS ────────────────────────────────────────────────────

export const allReviews = async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await updateReviewStatus(req.params.id, req.body.status);
    res.json(review);
  } catch (error) {
    next(error);
  }
};