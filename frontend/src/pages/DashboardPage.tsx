import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import { getMyBookingsAPI } from '../api/bookings.api';
import { getMyReservationsAPI } from '../api/reservations.api';
import type { Booking, Reservation } from '../types';

type Tab = 'bookings' | 'reservations';

const statusLabel: Record<string, string> = {
  pending: '⏳ Pendiente',
  confirmed: '✅ Confirmada',
  cancelled: '❌ Cancelada',
  contacted: '📞 Contactado',
};

const statusColor: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [bRes, rRes] = await Promise.all([
          getMyBookingsAPI(),
          getMyReservationsAPI(),
        ]);
        setBookings(bRes.data);
        setReservations(rRes.data);
      } catch {
        // silently fail — empty lists shown
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center">
        <p className="text-[#8B7355] text-sm tracking-widest uppercase">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-2">Mi cuenta</p>
          <h1 className="font-serif text-2xl md:text-3xl text-[#3d3530] mb-1">
            Hola, {user?.name}
          </h1>
          <p className="text-sm text-[#a09890] font-light">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {([
            ['bookings', 'Mis citas', bookings.length],
            ['reservations', 'Mis solicitudes', reservations.length],
          ] as const).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 p-4 text-center border transition-all ${
                tab === key
                  ? 'border-[#B8A99A] bg-white shadow-sm'
                  : 'border-[#e8e2da] bg-[#FAF8F6] hover:bg-white'
              }`}
            >
              <p className="font-serif text-2xl text-[#3d3530]">{count}</p>
              <p className="text-[10px] tracking-widest uppercase text-[#8B7355] mt-1">{label}</p>
            </button>
          ))}
        </div>

        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div className="bg-white border border-[#e8e2da]">
            <div className="p-4 border-b border-[#e8e2da] flex justify-between items-center">
              <h2 className="font-serif text-lg text-[#3d3530]">Citas de tratamiento</h2>
              <Link
                to="/booking"
                className="text-[10px] tracking-[0.15em] uppercase text-white bg-[#B8A99A] hover:bg-[#9A8B7A] px-4 py-2 transition-colors"
              >
                + Nueva cita
              </Link>
            </div>
            {bookings.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-[#a09890] mb-4">No tienes citas todavía.</p>
                <Link
                  to="/booking"
                  className="inline-block text-[11px] tracking-[0.15em] uppercase text-white bg-[#3d3530] hover:bg-[#2d2520] px-8 py-3 transition-colors"
                >
                  Reservar tu primera cita
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#f0ebe4]">
                {bookings.map((b) => (
                  <div key={b._id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#3d3530] capitalize">{b.service}</p>
                      <p className="text-xs text-[#a09890] mt-0.5">{fmtDate(b.date)}</p>
                      {b.notes && <p className="text-xs text-[#b5aca4] mt-1 truncate">{b.notes}</p>}
                    </div>
                    <span className={`text-[10px] tracking-wider uppercase px-3 py-1 border flex-shrink-0 ${statusColor[b.status] || ''}`}>
                      {statusLabel[b.status] || b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reservations tab */}
        {tab === 'reservations' && (
          <div className="bg-white border border-[#e8e2da]">
            <div className="p-4 border-b border-[#e8e2da]">
              <h2 className="font-serif text-lg text-[#3d3530]">Solicitudes (formaciones, productos, kits)</h2>
            </div>
            {reservations.length === 0 ? (
              <p className="p-10 text-center text-sm text-[#a09890]">No tienes solicitudes.</p>
            ) : (
              <div className="divide-y divide-[#f0ebe4]">
                {reservations.map((r) => (
                  <div key={r._id} className="p-4">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 flex-shrink-0 ${
                          r.type === 'formacion' ? 'bg-blue-50 text-blue-700' :
                          r.type === 'kit' ? 'bg-purple-50 text-purple-700' :
                          r.type === 'producto' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>{r.type}</span>
                        <span className="text-sm font-medium text-[#3d3530] truncate">{r.detalle || r.type}</span>
                      </div>
                      <span className={`text-[10px] tracking-wider uppercase px-3 py-1 border flex-shrink-0 ${statusColor[r.status] || ''}`}>
                        {statusLabel[r.status] || r.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#a09890]">{fmtDate(r.createdAt)}</p>
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
