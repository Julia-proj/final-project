// ============================================================
// models/user.model.js — Modelo de Usuario
// ============================================================
// Define la estructura de un usuario en MongoDB.
// Campos: name, email (único), password (encriptado), role.
// timestamps: true añade createdAt y updatedAt automáticamente.
// ============================================================

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'admin'],  // solo estos dos valores permitidos
    default: 'user'
  }

}, { timestamps: true });

export default mongoose.model('User', userSchema);