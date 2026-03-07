// Modelo universal de reservación. Para formaciones, kit y servicios.

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({

  // Связь с пользователем (обязательно — требуется логин)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Тип резервации
  type: {
    type: String,
    enum: ['servicio', 'formacion', 'kit'],
    required: true
  },

  // Имя (дублируем из user для удобства admin)
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  // Телефон (ОБЯЗАТЕЛЬНО для связи)
  telefono: {
    type: String,
    required: true,
    trim: true
  },

  // Детали — зависят от типа:
  //   servicio  → название процедуры + длина волос
  //   formacion → какое обучение хочет
  //   kit       → тип волос, комментарии
  detalle: {
    type: String,
    default: ''
  },

  // Дополнительные заметки от клиента
  notas: {
    type: String,
    default: ''
  },

  // Статус обработки администратором
  status: {
    type: String,
    enum: ['pending', 'contacted', 'confirmed', 'cancelled'],
    default: 'pending'
  }

}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);