# Keratin Madrid — Aplicación Web Full-Stack

Aplicación web completa para un salón de peluquería y tratamientos capilares en Madrid.  
Permite a los clientes reservar citas, solicitar información sobre servicios, dejar reseñas y realizar pagos con Stripe.  
Cuenta con un panel de administración para gestionar todas las entidades y notificaciones automáticas por email.

---

## Índice

1. [Tecnologías](#tecnologías)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Cómo funciona la aplicación](#cómo-funciona-la-aplicación)
4. [Variables de entorno](#variables-de-entorno)
5. [Instalación y ejecución local](#instalación-y-ejecución-local)
6. [Endpoints de la API](#endpoints-de-la-api)
7. [Despliegue](#despliegue)
8. [Proceso de desarrollo](#proceso-de-desarrollo)
9. [Mejoras futuras](#mejoras-futuras)

---

## Tecnologías

### Backend

| Tecnología   | Versión  | Uso                                      |
|--------------|----------|------------------------------------------|
| Node.js      | ≥18      | Entorno de ejecución del servidor        |
| Express      | 5.2.1    | Framework HTTP para crear la API REST    |
| MongoDB      | Atlas    | Base de datos NoSQL en la nube           |
| Mongoose     | 9.2.3    | ODM para modelar y validar datos         |
| JWT          | 9.0.3    | Tokens de autenticación (7 días)         |
| bcrypt       | 6.0.0    | Hash de contraseñas                      |
| Stripe       | 20.4.1   | Procesamiento de pagos online            |
| Resend       | 6.9.3    | Envío de emails transaccionales          |
| dotenv       | 17.3.1   | Carga de variables de entorno            |
| cors         | 2.8.6    | Control de acceso entre orígenes         |
| Nodemon      | 3.1.14   | Reinicio automático en desarrollo        |

### Frontend

| Tecnología       | Versión | Uso                                        |
|------------------|---------|--------------------------------------------|
| React            | 19.2    | Biblioteca principal de UI                 |
| TypeScript       | 5.9     | Tipado estático                            |
| Vite             | 7.3     | Bundler y servidor de desarrollo           |
| Tailwind CSS     | 4.2     | Framework de estilos (utility-first)       |
| Redux Toolkit    | 2.11    | Gestión de estado global                   |
| React Router     | 7.13    | Enrutamiento SPA                           |
| Axios            | 1.13    | Cliente HTTP con interceptores             |
| Stripe.js        | 8.9     | Integración de pagos en el frontend        |

---

## Estructura del proyecto

```
final-project/
├── README.md
│
├── backend/
│   ├── package.json
│   ├── .env                          ← variables secretas (no se sube a git)
│   └── src/
│       ├── index.js                  ← punto de entrada: Express, CORS, rutas
│       ├── config/
│       │   └── db.js                 ← conexión a MongoDB Atlas
│       ├── routes/
│       │   ├── auth.routes.js        ← /api/auth (register, login, me)
│       │   ├── booking.routes.js     ← /api/bookings (citas)
│       │   ├── reservation.routes.js ← /api/reservations (solicitudes)
│       │   ├── review.routes.js      ← /api/reviews (reseñas)
│       │   ├── admin.routes.js       ← /api/admin (gestión)
│       │   └── checkout.routes.js    ← /api/checkout (pagos Stripe)
│       ├── controllers/              ← reciben req/res, llaman a servicios
│       │   ├── auth.controller.js
│       │   ├── booking.controller.js
│       │   ├── reservation.controller.js
│       │   ├── review.controller.js
│       │   └── admin.controller.js
│       ├── services/                 ← lógica de negocio y acceso a DB
│       │   ├── auth.service.js
│       │   ├── booking.service.js
│       │   ├── reservation.service.js
│       │   └── review.service.js
│       ├── middlewares/
│       │   ├── auth.middleware.js     ← verifica JWT del header Authorization
│       │   ├── role.middleware.js     ← comprueba el rol (admin/user)
│       │   └── error.middleware.js    ← manejador global de errores
│       ├── models/                   ← esquemas de Mongoose
│       │   ├── user.model.js
│       │   ├── booking.model.js
│       │   ├── reservation.model.js
│       │   └── review.model.js
│       └── utils/
│           ├── password.js           ← hash y comparación con bcrypt
│           ├── token.js              ← firmar y verificar JWT
│           └── email.js              ← envío de emails con Resend
│
└── frontend/
    ├── package.json
    ├── index.html                    ← HTML base para Vite
    ├── vite.config.ts
    ├── tsconfig.json
    ├── eslint.config.js
    ├── public/
    │   ├── images/                   ← fotos del salón y servicios
    │   └── video/                    ← vídeo del hero
    └── src/
        ├── main.tsx                  ← punto de entrada React + Redux Provider
        ├── App.tsx                   ← rutas de la aplicación
        ├── index.css                 ← estilos globales y design tokens
        ├── types/
        │   └── index.ts             ← interfaces TypeScript compartidas
        ├── store/
        │   ├── store.ts             ← configuración de Redux store
        │   └── authSlice.ts         ← slice de autenticación (thunks + estado)
        ├── hooks/
        │   └── useAppHooks.ts       ← hooks tipados para Redux
        ├── api/
        │   ├── axiosInstance.ts     ← instancia de Axios con interceptor JWT
        │   ├── auth.api.ts          ← llamadas: register, login, getMe
        │   ├── bookings.api.ts      ← llamadas: citas + endpoints admin
        │   ├── reservations.api.ts  ← llamadas: solicitudes
        │   └── reviews.api.ts       ← llamadas: reseñas
        ├── components/
        │   ├── Navbar.tsx           ← barra de navegación responsive
        │   ├── HomePageSections.tsx ← todas las secciones de la landing page
        │   ├── InteractivePricing.tsx ← calculadora de precios interactiva
        │   ├── FloatingCTA.tsx      ← botón flotante de WhatsApp
        │   └── ProtectedRoute.tsx   ← wrapper de rutas protegidas
        └── pages/
            ├── HomePage.tsx         ← página principal (hero + secciones)
            ├── LoginPage.tsx        ← formulario de inicio de sesión
            ├── RegisterPage.tsx     ← formulario de registro
            ├── BookingPage.tsx      ← formulario para pedir cita
            ├── DashboardPage.tsx    ← panel del usuario (citas y solicitudes)
            └── AdminPage.tsx        ← panel de administración
```

---

## Cómo funciona la aplicación

### Flujo de autenticación

1. El usuario se registra en `/register` enviando nombre, email y contraseña.
2. El backend hashea la contraseña con bcrypt y guarda el usuario en MongoDB.
3. Se genera un token JWT firmado con `JWT_SECRET` (válido 7 días).
4. El frontend almacena el token en `localStorage` y en el estado de Redux.
5. En cada petición posterior, un interceptor de Axios añade el header `Authorization: Bearer <token>`.
6. El middleware `auth.middleware.js` del backend verifica el token y adjunta `req.user`.
7. Al recargar la página, `App.tsx` llama a `GET /api/auth/me` para restaurar la sesión.

### Flujo de reserva de cita

1. Un usuario autenticado accede a `/booking` y rellena el formulario (servicio, largo de pelo, fecha, notas).
2. Se envía `POST /api/bookings` con el token JWT.
3. El servicio crea el documento `Booking` en MongoDB vinculado al usuario.
4. El usuario puede ver sus citas en el Dashboard (`GET /api/bookings/my`).
5. El administrador puede ver todas las citas y cambiar su estado (pendiente, confirmada, cancelada).

### Flujo de solicitudes (reservations)

1. Cualquier visitante (sin registro) puede enviar una solicitud desde la landing page.
2. Se envía `POST /api/reservations/public` con nombre, teléfono, tipo y detalles.
3. El backend guarda la solicitud y envía un email de notificación al administrador usando Resend.
4. Los usuarios registrados también pueden crear solicitudes desde su Dashboard.
5. El administrador gestiona todas las solicitudes desde el panel admin.

### Flujo de reseñas

1. Cualquier visitante puede enviar una reseña con nombre, texto, estrellas y teléfono.
2. La reseña se crea con estado `pending` y se notifica al admin por email.
3. El administrador puede aprobar, ocultar o eliminar reseñas.
4. Solo las reseñas aprobadas aparecen en la landing page.

### Flujo de pagos (Stripe)

1. El usuario accede al checkout de Beauty Scripts.
2. El frontend solicita `POST /api/checkout/create-session` para crear una sesión de Stripe Embedded Checkout.
3. Stripe devuelve un `clientSecret` que el frontend usa para renderizar el formulario de pago.
4. Todo el procesamiento del pago lo gestiona Stripe de forma segura.

### Panel de administración

1. Solo los usuarios con `role: 'admin'` pueden acceder a `/admin`.
2. El middleware `requireRole('admin')` protege todos los endpoints de `/api/admin`.
3. Desde el panel se gestionan: citas, solicitudes, reseñas y usuarios.
4. Cada entidad tiene acciones: ver, cambiar estado, eliminar.

### Notificaciones por email

1. Se utiliza la API de Resend para enviar emails transaccionales.
2. Cuando se crea una nueva solicitud → `notifyNewReservation()` envía un email al admin con los detalles.
3. Cuando se crea una nueva reseña → `notifyNewReview()` envía un email al admin con las estrellas y el texto.
4. Los emails incluyen plantillas HTML con formato profesional.

---

## Variables de entorno

### Backend (`backend/.env`)

```env
# Base de datos
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/keratin-madrid

# Autenticación
JWT_SECRET=una_clave_secreta_larga_y_segura

# Servidor
PORT=3000

# CORS — URL del frontend (sin barra final)
FRONTEND_URL=http://localhost:5173

# Stripe — pagos online
STRIPE_SECRET_KEY=sk_test_...
STRIPE_SCRIPTS_PRICE_ID=price_...

# Resend — emails
RESEND_API_KEY=re_...
ADMIN_EMAIL=tu_email@ejemplo.com
```

### Frontend (`frontend/.env`)

```env
# URL base de la API (incluir /api)
VITE_API_URL=http://localhost:3000/api

# Stripe — clave pública
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Importante:** Los archivos `.env` nunca se suben al repositorio. Están incluidos en `.gitignore`.

---

## Instalación y ejecución local

### Requisitos previos

- Node.js 18 o superior
- npm
- Una cuenta en MongoDB Atlas (o MongoDB local)
- (Opcional) Cuenta en Stripe para pagos
- (Opcional) Cuenta en Resend para emails

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/keratin-madrid.git
cd keratin-madrid
```

2. **Instalar dependencias del backend**

```bash
cd backend
npm install
```

3. **Configurar variables de entorno del backend**

Crear el archivo `backend/.env` con las variables indicadas en la sección anterior.

4. **Instalar dependencias del frontend**

```bash
cd ../frontend
npm install
```

5. **Configurar variables de entorno del frontend**

Crear el archivo `frontend/.env` con las variables indicadas en la sección anterior.

6. **Ejecutar el backend** (en una terminal)

```bash
cd backend
npm run dev
```

El servidor arranca en `http://localhost:3000`. Se puede verificar con: `GET http://localhost:3000/health`

7. **Ejecutar el frontend** (en otra terminal)

```bash
cd frontend
npm run dev
```

La aplicación arranca en `http://localhost:5173`.

---

## Endpoints de la API

### Autenticación — `/api/auth`

| Método | Ruta        | Auth | Descripción                       |
|--------|-------------|------|-----------------------------------|
| POST   | `/register` | No   | Registrar nuevo usuario           |
| POST   | `/login`    | No   | Iniciar sesión (devuelve token)   |
| GET    | `/me`       | Sí   | Obtener datos del usuario actual  |

### Citas — `/api/bookings`

| Método | Ruta   | Auth | Descripción                        |
|--------|--------|------|------------------------------------|
| POST   | `/`    | Sí   | Crear nueva cita                   |
| GET    | `/my`  | Sí   | Ver mis citas                      |

### Solicitudes — `/api/reservations`

| Método | Ruta       | Auth | Descripción                             |
|--------|------------|------|-----------------------------------------|
| POST   | `/public`  | No   | Crear solicitud (visitante sin cuenta)  |
| POST   | `/`        | Sí   | Crear solicitud (usuario registrado)    |
| GET    | `/my`      | Sí   | Ver mis solicitudes                     |

### Reseñas — `/api/reviews`

| Método | Ruta   | Auth | Descripción                              |
|--------|--------|------|------------------------------------------|
| GET    | `/`    | No   | Ver reseñas aprobadas                    |
| POST   | `/`    | No   | Enviar nueva reseña                      |

### Admin — `/api/admin` (requiere rol admin)

| Método | Ruta                | Descripción                        |
|--------|---------------------|------------------------------------|
| GET    | `/bookings`         | Ver todas las citas                |
| PATCH  | `/bookings/:id`     | Actualizar estado de una cita      |
| GET    | `/reservations`     | Ver todas las solicitudes          |
| PATCH  | `/reservations/:id` | Actualizar estado de solicitud     |
| DELETE | `/reservations/:id` | Eliminar solicitud                 |
| GET    | `/reviews`          | Ver todas las reseñas              |
| PATCH  | `/reviews/:id`      | Actualizar estado de reseña        |
| DELETE | `/reviews/:id`      | Eliminar reseña                    |
| GET    | `/users`            | Ver todos los usuarios             |

### Pagos — `/api/checkout`

| Método | Ruta               | Auth | Descripción                       |
|--------|--------------------|------|-----------------------------------|
| POST   | `/create-session`  | No   | Crear sesión de Stripe Checkout   |

---

## Despliegue

La aplicación está preparada para desplegarse con:

### Frontend → Vercel

1. Conectar el repositorio de GitHub a Vercel.
2. Configurar el directorio raíz como `frontend`.
3. El comando de build es `npm run build` y el directorio de salida es `dist`.
4. Añadir las variables de entorno en el panel de Vercel:
   - `VITE_API_URL` = URL del backend en Render + `/api`
   - `VITE_STRIPE_PUBLISHABLE_KEY` = clave pública de Stripe

### Backend → Render

1. Crear un nuevo Web Service en Render conectado al repositorio.
2. Configurar el directorio raíz como `backend`.
3. Comando de build: `npm install`
4. Comando de inicio: `npm start`
5. Añadir todas las variables de entorno del backend:
   - `MONGO_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL` (URL de Vercel), `STRIPE_SECRET_KEY`, `STRIPE_SCRIPTS_PRICE_ID`, `RESEND_API_KEY`, `ADMIN_EMAIL`

### Base de datos → MongoDB Atlas

1. Crear un cluster gratuito (M0) en MongoDB Atlas.
2. Crear un usuario de base de datos y añadir la IP `0.0.0.0/0` a la whitelist (para Render).
3. Copiar la cadena de conexión y usarla como `MONGO_URI`.

---

## Proceso de desarrollo

Este proyecto lo construí paso a paso como proyecto final de desarrollo web full-stack.

**Backend — primeros pasos:**
Empecé creando el servidor con Express y conectándolo a MongoDB Atlas usando Mongoose. Definí los modelos de datos (User, Booking, Reservation, Review) pensando en qué información necesitaría cada entidad. Después creé las rutas, controladores y servicios siguiendo una arquitectura por capas: las rutas solo definen los endpoints, los controladores manejan request/response, y los servicios contienen la lógica de negocio real.

**Autenticación:**
Implementé registro y login con bcrypt para hashear contraseñas y JWT para generar tokens de sesión. Creé un middleware que verifica el token en las rutas protegidas y otro middleware para comprobar el rol del usuario (admin o user).

**Frontend — estructura base:**
Inicié el frontend con Vite + React + TypeScript. Configuré Tailwind CSS para los estilos, Redux Toolkit para el estado global y React Router para la navegación. Creé una instancia de Axios con un interceptor que añade automáticamente el token JWT a todas las peticiones.

**Páginas y componentes:**
Diseñé la landing page como una web premium de salón de belleza con varias secciones: hero con vídeo, servicios, precios interactivos, reseñas de Google y formularios de contacto. Creé las páginas de login, registro, booking y un dashboard donde los usuarios ven sus citas y solicitudes.

**Panel de administración:**
Añadí un panel completo para el administrador con pestañas para gestionar citas, solicitudes, reseñas y usuarios. Protegí tanto las rutas del frontend como los endpoints del backend con verificación de rol.

**Pagos con Stripe:**
Integré Stripe Embedded Checkout para procesar pagos de Beauty Scripts. El backend crea la sesión de pago y el frontend renderiza el formulario de Stripe.

**Emails con Resend:**
Configuré Resend para enviar notificaciones automáticas al administrador cuando llega una nueva solicitud o reseña, con plantillas HTML formateadas.

**Despliegue:**
Preparé el proyecto para producción: el frontend se despliega en Vercel y el backend en Render, ambos conectados a MongoDB Atlas.

---

## Mejoras futuras

- Añadir confirmación por email al usuario cuando su cita es aprobada.
- Implementar recuperación de contraseña con enlace por email.
- Añadir galería de trabajos realizados con subida de imágenes.
- Implementar sistema de notificaciones en tiempo real con WebSockets.
- Añadir paginación en el panel de administración.
- Integrar calendario visual para seleccionar fecha y hora de citas.
- Añadir tests unitarios y de integración con Jest/Vitest.
- Implementar rate limiting para proteger los endpoints públicos.
- Añadir modo oscuro.

---

## Autor

Proyecto desarrollado como trabajo final de desarrollo web full-stack.

---

## Licencia

ISC
