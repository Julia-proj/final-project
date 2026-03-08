// Página de reserva protegida. Envía datos al backend para crear una reserva.

import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-[#FAF8F6] py-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-14">
          <div className="inline-block px-6 py-2 mb-6 bg-[#B8A99A]/10 rounded-full">
            <span className="text-[#B8A99A] text-[11px] tracking-[0.3em] uppercase font-light">
              Reservas
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-[#3D3D3D] mb-3 tracking-wide">
            Reservar tu cita
          </h1>
          <p className="text-[#666666] font-light text-lg">
            Hola {user?.name}, elige tu tratamiento y fecha
          </p>
        </div>

        {/* УСПЕШНОЕ СООБЩЕНИЕ */}
        {success && (
          <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-light">
            ✅ ¡Reserva creada con éxito! Te contactaremos para confirmar.
            <button onClick={() => setSuccess(false)} className="ml-3 text-green-500 hover:text-green-700">✕</button>
          </div>
        )}

        {/* ФОРМА БРОНИРОВАНИЯ */}
        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-light text-[#3D3D3D] mb-8">Nueva reserva</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-base font-light">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* SERVICIO */}
            <div>
              <label htmlFor="service" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Tratamiento</label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"
              >
                <option value="">Seleccionar tratamiento...</option>
                {SERVICES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* LONGITUD DEL CABELLO */}
            <div>
              <label htmlFor="hairLength" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Longitud del cabello</label>
              <select
                id="hairLength"
                name="hairLength"
                value={form.hairLength}
                onChange={handleChange}
                required
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"
              >
                <option value="">Seleccionar longitud...</option>
                {HAIR_LENGTHS.map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>

            {/* FECHA */}
            <div>
              <label htmlFor="bookingDate" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Fecha deseada</label>
              <input
                id="bookingDate"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                min={minDate}
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"
              />
            </div>

            {/* NOTAS */}
            <div>
              <label htmlFor="bookingNotes" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Notas adicionales (opcional)</label>
              <textarea
                id="bookingNotes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Alergias, preferencias, preguntas..."
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A] resize-none"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] disabled:opacity-50 font-light transition-colors">
              {loading ? 'Enviando...' : 'SOLICITAR RESERVA'}
            </button>
          </form>
        </div>

        {/* MIS RESERVAS */}
        {myBookings.length > 0 && (
          <div className="card bg-white border border-[#e8e2da] p-8">
            <h2 className="font-serif text-2xl font-light text-[#3D3D3D] mb-8">Mis reservas</h2>
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