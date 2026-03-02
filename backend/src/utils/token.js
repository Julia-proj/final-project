import jwt from 'jsonwebtoken';

// generateToken: crea un token JWT con la información del usuario
export const generateToken = (payload) => {
  return jwt.sign(
    payload,                    // datos a guardar en el token
    process.env.JWT_SECRET,    // clave secreta para firmar (del .env)
    { expiresIn: '7d' }        // el token expira en 7 días
  );
};

// verifyToken: verifica si el token es válido y devuelve el payload
// si el token está manipulado o expirado, lanza un error
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};