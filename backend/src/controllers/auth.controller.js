// ============================================================
// controllers/auth.controller.js — Controlador de autenticación
// ============================================================
// Recibe las peticiones HTTP, llama al service correspondiente
// y devuelve la respuesta. Si hay error, lo pasa a next().
// ============================================================

import { registerUser, loginUser, getMe } from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    // req.body contiene { name, email, password } del formulario
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);   
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    // req.user.id viene del authMiddleware (el JWT decodificado)
    const user = await getMe(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};