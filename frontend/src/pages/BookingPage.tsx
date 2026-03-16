import { useState, useEffect } from 'react';
import { createBookingAPI, getMyBookingsAPI } from '../api/bookings.api';
import { useAppSelector } from '../hooks/useAppHooks';
import { useLanguage } from '../i18n/LanguageContext';
import type { Booking, BookingForm } from '../types';

export default function BookingPage() {
  const [form, setForm] = useState<BookingForm>({
    service: '',
    hairLength: '',
    date: '',
    notes: '',
  });

  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAppSelector((state) => state.auth.user);
  const { tr } = useLanguage();

  const SERVICES = [
    { value: 'keratina', label: tr.booking.services.keratina },
    { value: 'reconstruccion', label: tr.booking.services.reconstruccion },
    { value: 'peeling', label: tr.booking.services.peeling },
    { value: 'head-spa', label: tr.booking.services.headSpa },
  ];

  const HAIR_LENGTHS = [
    { value: 'short', label: tr.booking.hairLengths.short },
    { value: 'medium', label: tr.booking.hairLengths.medium },
    { value: 'long', label: tr.booking.hairLengths.long },
    { value: 'extra-long', label: tr.booking.hairLengths.extraLong },
  ];

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await getMyBookingsAPI();
        setMyBookings(res.data);
      } catch {
        // silently fail
      }
    };
    fetchMyBookings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBookingAPI(form);
      setSuccess(true);
      setForm({ service: '', hairLength: '', date: '', notes: '' });

      const res = await getMyBookingsAPI();
      setMyBookings(res.data);

    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || tr.booking.errorReserva);
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#FAF8F6] py-16 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-14">
          <div className="inline-block px-6 py-2 mb-6 bg-[#B8A99A]/10 rounded-full">
            <span className="text-[#B8A99A] text-[11px] tracking-[0.3em] uppercase font-light">
              {tr.booking.overline}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-[#3D3D3D] mb-3 tracking-wide">
            {tr.booking.title}
          </h1>
          <p className="text-[#666666] font-light text-lg">
            {tr.booking.hola} {user?.name}{tr.booking.elegirTratamiento}
          </p>
        </div>

        {success && (
          <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-light">
            {tr.booking.exito}
            <button onClick={() => setSuccess(false)} className="ml-3 text-green-500 hover:text-green-700">✕</button>
          </div>
        )}

        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-light text-[#3D3D3D] mb-8">{tr.booking.nuevaReserva}</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-base font-light">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">

            <div>
              <label htmlFor="service" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">{tr.booking.tratamiento}</label>
              <select id="service" name="service" value={form.service} onChange={handleChange} required
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]">
                <option value="">{tr.booking.seleccionarTratamiento}</option>
                {SERVICES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hairLength" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">{tr.booking.longitud}</label>
              <select id="hairLength" name="hairLength" value={form.hairLength} onChange={handleChange} required
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]">
                <option value="">{tr.booking.seleccionarLongitud}</option>
                {HAIR_LENGTHS.map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bookingDate" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">{tr.booking.fecha}</label>
              <input id="bookingDate" type="date" name="date" value={form.date} onChange={handleChange}
                required min={minDate}
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>

            <div>
              <label htmlFor="bookingNotes" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">{tr.booking.notas}</label>
              <textarea id="bookingNotes" name="notes" value={form.notes} onChange={handleChange}
                rows={4} placeholder={tr.booking.notasPlaceholder}
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A] resize-none"/>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] disabled:opacity-50 font-light transition-colors">
              {loading ? tr.booking.enviando : tr.booking.solicitar}
            </button>
          </form>
        </div>

        {myBookings.length > 0 && (
          <div className="card bg-white border border-[#e8e2da] p-8">
            <h2 className="font-serif text-2xl font-light text-[#3D3D3D] mb-8">{tr.booking.misReservas}</h2>
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
                  <span className={`badge-${booking.status}`}>
                    {booking.status === 'pending' && tr.booking.pendiente}
                    {booking.status === 'confirmed' && tr.booking.confirmada}
                    {booking.status === 'cancelled' && tr.booking.cancelada}
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
