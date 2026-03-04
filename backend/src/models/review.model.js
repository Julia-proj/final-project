// ============================================================
// models/review.model.js
// ============================================================
// РУС: Модель отзыва. Хранит имя, текст, оценку.
//      Если пользователь залогинен — привязывает к user.
// ESP: Modelo de reseña. Guarda nombre, texto y estrellas.
// ============================================================

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Связь с пользователем (опционально — может быть null)
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

  // Статус модерации — admin может одобрить или скрыть
  status: {
    type: String,
    enum: ['pending', 'approved', 'hidden'],
    default: 'pending'
  }

}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);