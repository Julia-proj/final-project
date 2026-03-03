
export interface User {
  id: string;           // MongoDB _id (бэк переименовывает в id при возврате)
  name: string;         // имя пользователя
  email: string;        // email (уникальный)
  role: 'user' | 'admin'; // роль — либо user, либо admin (enum из модели)
}

// ── BOOKING ─────────────────────────────────────────────────
// Копирует поля из backend/src/models/booking.model.js
export interface Booking {
  _id: string;                                      // MongoDB ID (здесь _id, не id)
  user: string | User;                              // может быть просто ID или полный объект (populate)
  service: string;                                  // название услуги
  hairLength: 'short' | 'medium' | 'long' | 'extra-long'; // длина волос (enum)
  date: string;                                     // дата (ISO string)
  status: 'pending' | 'confirmed' | 'cancelled';   // статус (enum)
  notes?: string;                                   // заметки (опционально — знак ?)
  createdAt: string;                                // автоматически MongoDB
}

// ── FORMS (то что вводит пользователь) ──────────────────────
// Это данные из HTML форм — то что отправляем на бэк

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
  notes?: string;   // ? = необязательное поле
}

// ── API RESPONSES ────────────────────────────────────────────
// Это то что ВОЗВРАЩАЕТ бэкенд в ответ на запрос
// Смотри auth.service.js — он возвращает { token, user }

export interface AuthResponse {
  token: string;  // JWT токен — строка вида "eyJhbGci..."
  user: User;     // объект пользователя
}




