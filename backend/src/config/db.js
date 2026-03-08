// ============================================================
// config/db.js — Conexión a MongoDB
// ============================================================
// Conecta a la base de datos usando la URI del archivo .env.
// Si la conexión falla, el proceso se detiene (process.exit).
// ============================================================

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};