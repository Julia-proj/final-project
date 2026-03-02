// ============================================================
// pages/BookingPage.tsx
// ============================================================
// РУС: Страница создания записи. Защищённая (ProtectedRoute).
//      Пользователь выбирает услугу, длину волос, дату.
//      Отправляем на POST /api/bookings → бэк сохраняет в MongoDB.
// ESP: Página de reserva protegida. Envía datos al backend para crear una reserva.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBookingAPI, getMyBookingsAPI } from '../api/bookings.api';
import { useAppSelector } from '../hooks/useAppHooks';
import type { Booking, BookingForm } from '../types';

// Список услуг (соответствует полям бэка — поле service: String)
const SERVICES = [
  { value: 'keratina', label: 'Alisado de Keratina' },
  { value: 'reconstruccion', label: 'Reconstrucción en Frío' },
  { value: 'peeling', label: 'Peeling Capilar' },
  { value: 'head-spa', label: 'Head Spa' },
];

// Длина волос (enum из booking.model.js)
const HAIR_LENGTHS = [
  { value: 'short', label: 'Corto (20-30 cm)' },
  { value: 'medium', label: 'Medio (30-50 cm)' },
  { value: 'long', label: 'Largo (50-70 cm)' },
  { value: 'extra-long', label: 'Extra largo (70+ cm)' },
];

export default function BookingPage() {
  // Состояние формы
  const [form, setForm] = useState<BookingForm>({
    service: '',
    hairLength: '',
    date: '',
    notes: '',
  });

  // Мои бронирования
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  // ── ЗАГРУЗКА МОЙ БРОНИРОВАНИЙ ─────────────────────────────
  // useEffect без Redux — локальные данные только для этой страницы
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await getMyBookingsAPI(); // GET /api/bookings/my
        setMyBookings(res.data);
      } catch {
        // если ошибка — просто не показываем список
      }
    };
    fetchMyBookings();
  }, []);

  // ── ИЗМЕНЕНИЕ ПОЛЕЙ ───────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ── ОТПРАВКА ФОРМЫ ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBookingAPI(form); // POST /api/bookings
      setSuccess(true);
      setForm({ service: '', hairLength: '', date: '', notes: '' }); // сбрасываем форму

      // Обновляем список бронирований
      const res = await getMyBookingsAPI();
      setMyBookings(res.data);

    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setLoading(false); // всегда убираем loading
    }
  };

  // Минимальная дата = завтра (не можем записаться в прошлое)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0]; // "2025-03-03"

  return (
    <div className="min-h-screen bg-[#FAF8F6] py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-10">
          <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
            <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">
              Reservas
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#3D3D3D] mb-2">
            Reservar tu cita
          </h1>
          <p className="text-[#666666] font-light">
            Hola {user?.name}, elige tu tratamiento y fecha
          </p>
        </div>

        {/* УСПЕШНОЕ СООБЩЕНИЕ */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
            ✅ ¡Reserva creada con éxito! Te contactaremos para confirmar.
            <button onClick={() => setSuccess(false)} className="ml-3 text-green-500 hover:text-green-700">✕</button>
          </div>
        )}

        {/* ФОРМА БРОНИРОВАНИЯ */}
        <div className="card mb-8">
          <h2 className="font-serif text-xl font-medium text-[#3D3D3D] mb-6">Nueva reserva</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* SERVICIO */}
            <div>
              <label className="form-label">Tratamiento</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Seleccionar tratamiento...</option>
                {SERVICES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* LONGITUD DEL CABELLO */}
            <div>
              <label className="form-label">Longitud del cabello</label>
              <select
                name="hairLength"
                value={form.hairLength}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Seleccionar longitud...</option>
                {HAIR_LENGTHS.map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>

            {/* FECHA */}
            <div>
              <label className="form-label">Fecha deseada</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                min={minDate}
                className="input-field"
              />
            </div>

            {/* NOTAS */}
            <div>
              <label className="form-label">Notas adicionales (opcional)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Alergias, preferencias, preguntas..."
                className="input-field resize-none"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Enviando...' : 'SOLICITAR RESERVA'}
            </button>
          </form>
        </div>

        {/* MIS RESERVAS */}
        {myBookings.length > 0 && (
          <div className="card">
            <h2 className="font-serif text-xl font-medium text-[#3D3D3D] mb-4">Mis reservas</h2>
            <div className="space-y-3">
              {myBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 border border-[#E8E4E0] rounded-lg">
                  <div>
                    <p className="font-medium text-[#3D3D3D] text-sm">{booking.service}</p>
                    <p className="text-[#666666] text-xs">
                      {new Date(booking.date).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  {/* Badge de status */}
                  <span className={`badge-${booking.status}`}>
                    {booking.status === 'pending' && 'Pendiente'}
                    {booking.status === 'confirmed' && 'Confirmada ✓'}
                    {booking.status === 'cancelled' && 'Cancelada'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="gold-divider mt-8" />
      </div>
    </div>
  );
}