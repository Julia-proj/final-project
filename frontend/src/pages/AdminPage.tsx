// ============================================================
// pages/AdminPage.tsx
// ============================================================
// РУС: Панель администратора. Видит ВСЕ бронирования,
//      может менять их статус (pending → confirmed/cancelled).
// ESP: Panel de administración. Ve todas las reservas y puede cambiar su estado.
//
// ПОТОК:
//   монтирование → getAllBookingsAPI() → показываем список
//   нажимаем кнопку → updateBookingStatusAPI(id, status) → обновляем список
// ============================================================

import { useState, useEffect } from 'react';
import { getAllBookingsAPI, updateBookingStatusAPI } from '../api/bookings.api';
import type { Booking } from '../types';

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null); // ID бронирования в процессе обновления

  // ── ЗАГРУЗКА ВСЕХ БРОНИРОВАНИЙ ────────────────────────────
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookingsAPI(); // GET /api/admin/bookings
      setBookings(res.data);
    } catch {
      setError('Error al cargar reservas. Verifica que eres admin.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect = запускаем при первой загрузке компонента
  useEffect(() => {
    fetchBookings();
  }, []);

  // ── ИЗМЕНЕНИЕ СТАТУСА ─────────────────────────────────────
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId); // показываем "загрузка" для этой строки
    try {
      // PATCH /api/admin/bookings/:id/status
      await updateBookingStatusAPI(bookingId, newStatus);
      // Обновляем список локально (без повторного запроса)
      setBookings(bookings.map(b =>
        // Для каждого бронирования: если ID совпадает — меняем статус
        b._id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b
      ));
    } catch {
      alert('Error al actualizar el estado');
    } finally {
      setUpdating(null);
    }
  };

  // ── ФИЛЬТРАЦИЯ ────────────────────────────────────────────
  const [filter, setFilter] = useState<string>('all');
  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  // Счётчики по статусам
  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center">
        <div className="text-[#B8A99A] text-center">
          <div className="w-8 h-8 border-2 border-[#B8A99A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-light text-[#666666]">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ЗАГОЛОВОК */}
        <div className="mb-8">
          <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
            <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">
              Panel Admin
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#3D3D3D]">
            Gestión de reservas
          </h1>
          <p className="text-[#666666] font-light mt-1">
            {bookings.length} reservas en total
          </p>
        </div>

        {/* ОШИБКА */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', count: counts.all, key: 'all', color: 'bg-[#B8A99A]' },
            { label: 'Pendientes', count: counts.pending, key: 'pending', color: 'bg-yellow-400' },
            { label: 'Confirmadas', count: counts.confirmed, key: 'confirmed', color: 'bg-green-400' },
            { label: 'Canceladas', count: counts.cancelled, key: 'cancelled', color: 'bg-red-400' },
          ].map(({ label, count, key, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`card text-center cursor-pointer transition-all ${filter === key ? 'ring-2 ring-[#B8A99A]' : 'hover:shadow-md'}`}
            >
              <div className={`${color} text-white text-2xl font-serif font-bold rounded-lg p-2 mb-2`}>
                {count}
              </div>
              <p className="text-sm text-[#666666] font-light">{label}</p>
            </button>
          ))}
        </div>

        {/* TABLA БРОНИРОВАНИЙ */}
        <div className="card overflow-hidden p-0">
          <div className="p-4 border-b border-[#E8E4E0] flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium text-[#3D3D3D]">
              {filter === 'all' ? 'Todas las reservas' : `Reservas: ${filter}`}
            </h2>
            <button
              onClick={fetchBookings}
              className="text-sm text-[#B8A99A] hover:text-[#9A8B7A] transition-colors"
            >
              ↻ Actualizar
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-[#666666] font-light">
              No hay reservas en esta categoría.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF8F6] border-b border-[#E8E4E0]">
                  <tr>
                    <th className="text-left p-4 text-[#666666] font-medium">Cliente</th>
                    <th className="text-left p-4 text-[#666666] font-medium">Servicio</th>
                    <th className="text-left p-4 text-[#666666] font-medium">Fecha</th>
                    <th className="text-left p-4 text-[#666666] font-medium">Estado</th>
                    <th className="text-left p-4 text-[#666666] font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    // Пользователь может быть объектом (если бэк populate) или строкой (ID)
                    const userInfo = typeof booking.user === 'object' ? booking.user : null;

                    return (
                      <tr key={booking._id} className="border-b border-[#E8E4E0] hover:bg-[#FAF8F6] transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-[#3D3D3D]">{userInfo?.name || 'Usuario'}</p>
                          <p className="text-[#666666] text-xs">{userInfo?.email || ''}</p>
                        </td>
                        <td className="p-4 text-[#3D3D3D] capitalize">{booking.service}</td>
                        <td className="p-4 text-[#666666]">
                          {new Date(booking.date).toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="p-4">
                          <span className={`badge-${booking.status}`}>
                            {booking.status === 'pending' && '⏳ Pendiente'}
                            {booking.status === 'confirmed' && '✅ Confirmada'}
                            {booking.status === 'cancelled' && '❌ Cancelada'}
                          </span>
                        </td>
                        <td className="p-4">
                          {/* Кнопки только если не в этом статусе */}
                          <div className="flex gap-2">
                            {booking.status !== 'confirmed' && (
                              <button
                                onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                disabled={updating === booking._id}
                                className="text-xs px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors disabled:opacity-50"
                              >
                                {updating === booking._id ? '...' : 'Confirmar'}
                              </button>
                            )}
                            {booking.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                disabled={updating === booking._id}
                                className="text-xs px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                {updating === booking._id ? '...' : 'Cancelar'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="gold-divider mt-8" />
      </div>
    </div>
  );
}
