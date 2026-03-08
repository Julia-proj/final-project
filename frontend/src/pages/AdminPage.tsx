// ============================================================
// pages/AdminPage.tsx — Panel de administración
// ============================================================
// Página con 3 pestañas: Reservas (citas), Solicitudes
// (formaciones, kit, productos) y Reseñas.
// El admin puede ver todo y cambiar estados.
//
// Para acceder como admin:
//   1. Registrarse como usuario normal
//   2. En MongoDB Compass cambiar el campo role a "admin"
//   3. Volver a iniciar sesión
// ============================================================

import { useState, useEffect } from 'react';
import {
  getAllBookingsAPI, updateBookingStatusAPI,
  getAllReservationsAPI, updateReservationStatusAPI,
  getAllReviewsAPI, updateReviewStatusAPI
} from '../api/bookings.api';
import type { Booking, Reservation, Review } from '../types';

type Tab = 'bookings' | 'reservations' | 'reviews';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar todos los datos al montar el componente
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, rRes, revRes] = await Promise.all([
        getAllBookingsAPI(),
        getAllReservationsAPI(),
        getAllReviewsAPI()
      ]);
      setBookings(bRes.data);
      setReservations(rRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Funciones para actualizar estado desde el panel
  const updateBooking = async (id: string, status: string) => {
    await updateBookingStatusAPI(id, status);
    setBookings(bs => bs.map(b => b._id === id ? { ...b, status: status as Booking['status'] } : b));
  };

  const updateReservation = async (id: string, status: string) => {
    await updateReservationStatusAPI(id, status);
    setReservations(rs => rs.map(r => r._id === id ? { ...r, status: status as Reservation['status'] } : r));
  };

  const updateReview = async (id: string, status: string) => {
    await updateReviewStatusAPI(id, status);
    setReviews(rs => rs.map(r => r._id === id ? { ...r, status: status as Review['status'] } : r));
  };

  // Render

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center">
        <p className="text-[#8B7355] text-sm">Cargando panel admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6] py-8 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-2">Panel Admin</p>
          <h1 className="font-serif text-2xl md:text-3xl text-[#3D3D3D]">Gestión</h1>
        </div>

        {/* Contadores por pestaña */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { key: 'bookings' as Tab, label: 'Reservas', count: bookings.length },
            { key: 'reservations' as Tab, label: 'Solicitudes', count: reservations.length },
            { key: 'reviews' as Tab, label: 'Reseñas', count: reviews.length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`p-3 text-center border transition-all ${tab === t.key ? 'border-[#B8A99A] bg-white' : 'border-[#e8e2da] bg-[#FAF8F6] hover:bg-white'}`}>
              <p className="font-serif text-2xl text-[#3d3530]">{t.count}</p>
              <p className="text-[10px] tracking-widest uppercase text-[#8B7355]">{t.label}</p>
            </button>
          ))}
        </div>

        {/* ── TAB: BOOKINGS ── */}
        {tab === 'bookings' && (
          <div className="bg-white border border-[#e8e2da] overflow-hidden">
            <div className="p-4 border-b border-[#e8e2da] flex justify-between items-center">
              <h2 className="font-serif text-lg text-[#3d3530]">Reservas de servicios</h2>
              <button onClick={fetchAll} className="text-xs text-[#B8A99A]">↻ Actualizar</button>
            </div>
            {bookings.length === 0 ? (
              <p className="p-6 text-center text-sm text-[#a09890]">No hay reservas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF8F6] border-b border-[#e8e2da]">
                    <tr>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Cliente</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Servicio</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Fecha</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Estado</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const u = typeof b.user === 'object' ? b.user : null;
                      return (
                        <tr key={b._id} className="border-b border-[#f0ebe4]">
                          <td className="p-3">
                            <p className="font-medium text-[#3d3530] text-xs">{u?.name || '-'}</p>
                            <p className="text-[#a09890] text-[10px]">{u?.email || ''}</p>
                          </td>
                          <td className="p-3 text-xs capitalize">{b.service}</td>
                          <td className="p-3 text-xs text-[#7a6f68]">
                            {new Date(b.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-3 text-xs">
                            {b.status === 'pending' && '⏳ Pendiente'}
                            {b.status === 'confirmed' && '✅ Confirmada'}
                            {b.status === 'cancelled' && '❌ Cancelada'}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              {b.status !== 'confirmed' && (
                                <button onClick={() => updateBooking(b._id, 'confirmed')}
                                  className="text-[10px] px-2 py-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
                                  ✓
                                </button>
                              )}
                              {b.status !== 'cancelled' && (
                                <button onClick={() => updateBooking(b._id, 'cancelled')}
                                  className="text-[10px] px-2 py-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
                                  ✕
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
        )}

        {/* ── TAB: RESERVATIONS ── */}
        {tab === 'reservations' && (
          <div className="bg-white border border-[#e8e2da] overflow-hidden">
            <div className="p-4 border-b border-[#e8e2da]">
              <h2 className="font-serif text-lg text-[#3d3530]">Solicitudes (formaciones, kit, servicios)</h2>
            </div>
            {reservations.length === 0 ? (
              <p className="p-6 text-center text-sm text-[#a09890]">No hay solicitudes.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF8F6] border-b border-[#e8e2da]">
                    <tr>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Nombre</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Tipo</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Teléfono</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Detalle</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Fecha</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Estado</th>
                      <th className="text-left p-3 text-[#8B7355] font-medium text-xs">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(r => (
                      <tr key={r._id} className="border-b border-[#f0ebe4]">
                        <td className="p-3 text-xs font-medium text-[#3d3530]">{r.nombre}</td>
                        <td className="p-3">
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                            r.type === 'formacion' ? 'bg-blue-50 text-blue-700' :
                            r.type === 'kit' ? 'bg-purple-50 text-purple-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>{r.type}</span>
                        </td>
                        <td className="p-3 text-xs">{r.telefono}</td>
                        <td className="p-3 text-xs text-[#7a6f68] max-w-[150px] truncate">{r.detalle}</td>
                        <td className="p-3 text-xs text-[#7a6f68]">
                          {new Date(r.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-3 text-xs">
                          {r.status === 'pending' && '⏳'}
                          {r.status === 'contacted' && '📞'}
                          {r.status === 'confirmed' && '✅'}
                          {r.status === 'cancelled' && '❌'}
                          {' '}{r.status}
                        </td>
                        <td className="p-3">
                          <select
                            value={r.status}
                            onChange={(e) => updateReservation(r._id, e.target.value)}
                            className="text-[10px] border border-[#e8e2da] px-1 py-0.5 bg-white">
                            <option value="pending">Pendiente</option>
                            <option value="contacted">Contactado</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: REVIEWS ── */}
        {tab === 'reviews' && (
          <div className="bg-white border border-[#e8e2da] overflow-hidden">
            <div className="p-4 border-b border-[#e8e2da]">
              <h2 className="font-serif text-lg text-[#3d3530]">Reseñas de clientes</h2>
            </div>
            {reviews.length === 0 ? (
              <p className="p-6 text-center text-sm text-[#a09890]">No hay reseñas.</p>
            ) : (
              <div className="divide-y divide-[#f0ebe4]">
                {reviews.map(r => (
                  <div key={r._id} className="p-4 flex gap-4 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-[#3d3530]">{r.nombre}</span>
                        <span className="text-[#B8A99A] text-xs">{'★'.repeat(r.estrellas)}</span>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                          r.status === 'approved' ? 'bg-green-50 text-green-700' :
                          r.status === 'hidden' ? 'bg-red-50 text-red-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>{r.status}</span>
                      </div>
                      <p className="text-sm text-[#7a6f68] italic">"{r.texto}"</p>
                      <p className="text-[10px] text-[#b5aca4] mt-1">
                        {new Date(r.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {r.telefono && <span className="ml-3">📱 {r.telefono}</span>}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {r.status !== 'approved' && (
                        <button onClick={() => updateReview(r._id, 'approved')}
                          className="text-[10px] px-2 py-1 bg-green-50 text-green-700 border border-green-200">
                          Aprobar
                        </button>
                      )}
                      {r.status !== 'hidden' && (
                        <button onClick={() => updateReview(r._id, 'hidden')}
                          className="text-[10px] px-2 py-1 bg-red-50 text-red-700 border border-red-200">
                          Ocultar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
