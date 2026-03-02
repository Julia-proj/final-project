# Backend API

## Descripción

Este proyecto es un backend construido con Node.js y Express.  
Se conecta a MongoDB usando Mongoose e incluye lógica básica de autenticación con JWT y encriptación de contraseñas con bcrypt.

El servidor se ejecuta fuera del navegador y expone endpoints de tipo REST.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- Morgan
- Nodemon (solo en desarrollo)

---

## Estructura del proyecto

backend/
  src/
    config/
    models/
    controllers/
    services/
    routes/
    middlewares/
    index.js
  .env
  .gitignore
  package.json
  package-lock.json
  README.md

---

## Instalación

Clonar el repositorio e instalar dependencias:

npm install

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto y añadir las variables necesarias, por ejemplo:

MONGO_URI=tu_cadena_de_conexion  
JWT_SECRET=tu_clave_secreta  
PORT=3000  

---

## Ejecutar el proyecto

Modo desarrollo (reinicio automático con nodemon):

npm run dev

Modo producción:

npm start

---

## Notas

- Nodemon se utiliza únicamente durante el desarrollo.
- El archivo `.env` no se sube al repositorio.
- El servidor debe estar en ejecución para poder acceder a los endpoints.
