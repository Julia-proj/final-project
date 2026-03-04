// ============================================================
// types/index.ts
// ============================================================
// РУС: Все TypeScript типы проекта в одном месте.
//      Каждый interface = "форма" данных.
// ESP: Todos los tipos TypeScript del proyecto.
// ============================================================

// ── USER (пользователь) ──────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// ── BOOKING (запись на процедуру — старая модель) ────────────
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

// ── RESERVATION (универсальная резервация) ───────────────────
// Используется для: formaciones, kit, servicios
export interface Reservation {
  _id: string;
  user: string | User;
  type: 'servicio' | 'formacion' | 'kit';
  nombre: string;
  telefono: string;
  detalle: string;
  notas: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// ── REVIEW (отзыв) ──────────────────────────────────────────
export interface Review {
  _id: string;
  user: string | User | null;
  nombre: string;
  texto: string;
  estrellas: number;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

// ── FORMS (данные из HTML форм) ──────────────────────────────

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
  type: 'servicio' | 'formacion' | 'kit';
  nombre: string;
  telefono: string;
  detalle: string;
  notas: string;
}

export interface ReviewForm {
  nombre: string;
  texto: string;
  estrellas: number;
}

// ── API RESPONSES ────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: User;
}

