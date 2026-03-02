import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/token.js';

//  REGISTRAR USUARIO 
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

// LOGIN 
export const loginUser = async ({ email, password }) => {

  // 1. Buscar usuario por email
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 401, message: 'Credenciales incorrectas' };
  }

  // 2. Comparar password con el hash guardado
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

export const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  // .select('-password') = devuelve todo EXCEPTO password — seguro
  if (!user) {
    throw { status: 404, message: 'Usuario no encontrado' };
  }
  return { id: user._id, name: user.name, email: user.email, role: user.role };
};