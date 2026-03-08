// ============================================================
// models/review.model.js — Modelo de Reseña
// ============================================================
// Guarda reseñas de clientes. El campo user es opcional porque
// se puede dejar una reseña sin estar logueado (anónima).
// El admin modera las reseñas cambiando el status.
// ============================================================

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({

  // Referencia al usuario (null si es anónima)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  nombre: {
    type: String,
    required: true,
    trim: true
  },

  telefono: {
    type: String,
    default: '',
    trim: true
  },

  texto: {
    type: String,
    required: true,
    trim: true
  },

  estrellas: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },

  // Estado de moderación (el admin puede aprobar u ocultar)
  status: {
    type: String,
    enum: ['pending', 'approved', 'hidden'],
    default: 'pending'
  }

}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);