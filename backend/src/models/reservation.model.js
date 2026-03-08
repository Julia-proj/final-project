// ============================================================
// models/reservation.model.js — Modelo de Solicitud
// ============================================================
// Modelo universal para solicitudes de servicios, formaciones,
// kits y productos. El campo user es opcional porque las
// solicitudes públicas (sin login) no tienen usuario vinculado.
// ============================================================

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({

  // Referencia al usuario (null si es solicitud pública)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Tipo de solicitud
  type: {
    type: String,
    enum: ['servicio', 'formacion', 'kit', 'producto'],
    required: true
  },

  // Nombre del cliente
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  // Teléfono de contacto (obligatorio)
  telefono: {
    type: String,
    required: true,
    trim: true
  },

  // Detalles según el tipo (procedimiento, formación, tipo de cabello...)
  detalle: {
    type: String,
    default: ''
  },

  // Notas adicionales del cliente
  notas: {
    type: String,
    default: ''
  },

  // Estado de la solicitud (gestionado por admin)
  status: {
    type: String,
    enum: ['pending', 'contacted', 'confirmed', 'cancelled'],
    default: 'pending'
  }

}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);