// ============================================================
// services/auth.service.js — Lógica de autenticación
// ============================================================
// Contiene la lógica de registro, login y obtener datos del
// usuario actual. Aquí se encripta la contraseña, se comparan
// credenciales y se generan tokens JWT.
// ============================================================

import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/token.js';

// Registrar un nuevo usuario
export const registerUser = async ({ name, email, password }) => {

  // 1. Comprobar si ya existe un usuario con ese email
  const existingUser = await User.findOne({ email });  
  if (existingUser) {
    // Lanzamos un error con status para que errorHandler lo capture
    throw { status: 409, message: 'Este email ya está registrado' };
  }

  // 2. Encriptar la contraseña
  const hashedPassword = await hashPassword(password);  

  // 3. Crear el usuario en MongoDB
  const user = await User.create({                     
    name,
    email,
    password: hashedPassword
  });

  // 4. Generar el token JWT
  const token = generateToken({ id: user._id, role: user.role });  

  // 5. Devolver token y datos del usuario (¡sin el password!)
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  };
};

// Iniciar sesión
export const loginUser = async ({ email, password }) => {

  // 1. Buscar usuario por email
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 401, message: 'Credenciales incorrectas' };
  }

  // 2. Verificar que tenga contraseña (usuarios Google no tienen)
  if (!user.password) {
    throw { status: 401, message: 'Esta cuenta usa inicio de sesión con Google' };
  }

  // 3. Comparar password con el hash guardado
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw { status: 401, message: 'Credenciales incorrectas' };
  }

  // 3. Generar token
  const token = generateToken({ id: user._id, role: user.role });

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  };
};

// Autenticación con Google (OAuth2 access_token)
export const googleAuthUser = async (accessToken) => {
  if (!accessToken) throw { status: 400, message: 'access_token requerido' };

  // 1. Verificar el access_token obteniendo datos del usuario desde Google
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    console.error('Google userinfo error:', response.status, errBody);
    throw { status: 401, message: 'Token de Google inválido' };
  }
  const payload = await response.json();
  const { sub: googleId, email, name, picture } = payload;
  if (!email) throw { status: 400, message: 'Google no devolvió email' };

  // 2. Buscar usuario existente (por googleId o email)
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Vincular googleId si se registró antes con email/password
    if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = picture;
      await user.save();
    }
  } else {
    // 3. Crear usuario nuevo
    user = await User.create({ name, email, googleId, avatar: picture });
  }

  const token = generateToken({ id: user._id, role: user.role });
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } };
};

// Obtener datos del usuario actual (para restaurar sesión al recargar)
export const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  // .select('-password') = devuelve todo EXCEPTO password — seguro
  if (!user) {
    throw { status: 404, message: 'Usuario no encontrado' };
  }
  return { id: user._id, name: user.name, email: user.email, role: user.role };
};