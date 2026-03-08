// ============================================================
// utils/password.js — Encriptación de contraseñas
// ============================================================
// Usa bcrypt para encriptar y comparar contraseñas.
// SALT_ROUNDS define la complejidad del hash (10 es estándar).
// ============================================================

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Encripta una contraseña en texto plano
export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

// Compara la contraseña del usuario con el hash guardado en la DB
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};