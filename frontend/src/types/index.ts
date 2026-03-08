// ============================================================
// types/index.ts — Interfaces TypeScript del proyecto
// ============================================================
// Define los tipos para usuarios, citas, solicitudes, reseñas,
// formularios y respuestas de la API. Estos tipos se comparten
// entre componentes, store y capa de API.
// ============================================================

// USER 
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

//  BOOKING 
export interface Booking {
  _id: string;
  user: string | User;
  service: string;
  hairLength: 'short' | 'medium' | 'long' | 'extra-long';
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

// RESERVATION 
// formaciones, kit, servicios
export interface Reservation {
  _id: string;
  user: string | User;
  type: 'servicio' | 'formacion' | 'kit' | 'producto';
  nombre: string;
  telefono: string;
  detalle: string;
  notas: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// REVIEW 
export interface Review {
  _id: string;
  user: string | User | null;
  nombre: string;
  texto: string;
  estrellas: number;
  telefono?: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

// FORMS 

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface BookingForm {
  service: string;
  hairLength: string;
  date: string;
  notes?: string;
}

export interface ReservationForm {
  type: 'servicio' | 'formacion' | 'kit' | 'producto';
  nombre: string;
  telefono: string;
  detalle: string;
  notas: string;
}

export interface ReviewForm {
  nombre: string;
  texto: string;
  estrellas: number;
  telefono?: string;
}

// API RESPONSES 

export interface AuthResponse {
  token: string;
  user: User;
}

