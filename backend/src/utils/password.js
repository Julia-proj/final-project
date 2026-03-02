import bcrypt from 'bcrypt';           // librería de encriptación

const SALT_ROUNDS = 10;              // cuántas veces encripta 

// Convierte "mi_contraseña123" en "$2b$10$xK8p..." 
export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);  // 
};

// Compara el password que escribe el usuario con el hash guardado en DB
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);  // 
};