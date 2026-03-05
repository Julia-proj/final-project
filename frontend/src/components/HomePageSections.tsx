import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import { createReviewAPI } from '../api/reviews.api';
import { createReservationAPI } from '../api/reservations.api';

// ── Placeholder ──────────────────────────────────────────────
function ImgPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f0ebe4]">
      <svg className="w-6 h-6 text-[#c9bfb5] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="text-[9px] tracking-widest uppercase text-[#c9bfb5]">{label}</span>
    </div>
  );
}

// ── Модальная форма резервации ────────────────────────────────
interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'servicio' | 'formacion' | 'kit';
  title: string;
  detalleLabel: string;
  detallePlaceholder: string;
  successMessage: string;
}

function ReservationModal({
  isOpen,
  onClose,
  type,
  title,
  detalleLabel,
  detallePlaceholder,
  successMessage,
}: ReservationModalProps) {
  const user = useAppSelector((s) => s.auth.user);
  const [form, setForm] = useState({ nombre: user?.name || '', telefono: '', detalle: '', notas: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.name) setForm((f) => ({ ...f, nombre: user.name }));
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError('Nombre y teléfono son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createReservationAPI({
        type,
        nombre: form.nombre,
        telefono: form.telefono,
        detalle: form.detalle,
        notas: form.notas,
      });
      setSent(true);
    } catch {
      setError('Error al enviar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white max-w-md w-full p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-[#a09890] hover:text-[#3d3530]">
          ✕
        </button>
        <h3 className="font-serif text-xl text-[#3d3530] mb-4">{title}</h3>

        {sent ? (
          <div className="text-center py-6">
            <p className="text-[#8B7355] mb-2">✅ {successMessage}</p>
            <p className="text-sm text-[#a09890]">Te contactaremos pronto.</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"
              />
            </div>

            <div>
              <label className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Teléfono *</label>
              <input
                type="tel"
                value={form.telefono}
                placeholder="+34 6XX XXX XXX"
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"
              />
            </div>

            <div>
              <label className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">
                {detalleLabel}
              </label>
              <input
                type="text"
                value={form.detalle}
                placeholder={detallePlaceholder}
                onChange={(e) => setForm((f) => ({ ...f, detalle: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"
              />
            </div>

            <div>
              <label className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">
                Notas (opcional)
              </label>
              <textarea
                rows={2}
                value={form.notas}
                placeholder="Comentarios..."
                onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A] resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── useRequireAuth ────────────────────────────────────────────
function useRequireAuth() {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const requireAuth = (callback: () => void) => {
    if (!user) {
      navigate('/login');
    } else {
      callback();
    }
  };
  return { user, requireAuth };
}

// ═══════════════════════════════════════════════════════════════
// 1. ¿POR QUÉ ELEGIR?
// ═══════════════════════════════════════════════════════════════

const beneficios = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="m21 21-4.35-4.35" />
      </svg>
    ),
    titulo: 'Diagnóstico con tricóscopo',
    texto: 'Analizamos cabello y cuero cabelludo antes de elegir protocolo.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
        />
      </svg>
    ),
    titulo: 'Protocolos exclusivos',
    texto: 'Tecnología premium anti-daño. Fórmulas seguras.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    ),
    titulo: 'Servicio de alto nivel',
    texto: 'Atención personalizada y cuidado en cada detalle.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    ),
    titulo: 'Seguimiento y cuidado',
    texto: 'Plan claro para prolongar resultados al máximo.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    titulo: 'Corrección de hábitos',
    texto: 'Ajustamos hábitos sencillos que marcan la diferencia.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
    titulo: 'Resultados duraderos',
    texto: 'Trabajamos para meses, no para un día.',
  },
];

export function PorQueElegirSection() {
  return (
    <section id="inicio" className="bg-[#FDFCFA] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Beneficios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">
            ¿Por qué elegir Keratin Madrid?
          </h2>
          <p className="text-[#8B7355] text-base md:text-lg max-w-lg mx-auto">
            Nos diferenciamos por la salud capilar y resultados duraderos.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {beneficios.map((b, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-4 md:p-6 border border-[#f0ebe4] hover:border-[#B8A99A] transition-all"
            >
              <div className="w-10 h-10 flex items-center justify-center text-[#8B7355]">{b.icon}</div>
              <h3 className="font-serif text-base md:text-xl text-[#3d3530]">{b.titulo}</h3>
              <p className="text-[#7a6f68] text-xs md:text-sm leading-relaxed">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. TRATAMIENTOS
// ═══════════════════════════════════════════════════════════════

const tratamientos = [
  {
    img: '/images/keratina.jpg',
    tag: 'Bestseller',
    nombre: 'Alisado de Keratina',
    duracion: '3–6 meses',
    desc: 'Alisado seguro, sin formol. Adaptado al diagnóstico previo.',
    ben: ['Reduce frizz', 'Brillo espejo', 'Más disciplina', 'Ahorra tiempo'],
    indicado: 'Rizados, encrespados, rebeldes',
    efecto: 'Liso y manejable 3–6 meses.',
  },
  {
    img: '/images/reconstruccion.jpg',
    tag: 'Reparador',
    nombre: 'Reconstrucción en frío',
    duracion: 'Acumulativo',
    desc: 'Recuperación profunda sin alisar. Restaura fuerza y elasticidad.',
    ben: ['Proteínas', 'Reduce rotura', 'Mejora brillo', 'Compatible decoloraciones'],
    indicado: 'Seco, dañado, decolorado',
    efecto: 'Más fuerte, resultado acumulativo.',
  },
  {
    img: '/images/peeling.jpg',
    tag: 'Detox',
    nombre: 'Peeling Capilar',
    duracion: 'Limpieza + diagnóstico',
    desc: 'Limpieza profunda con diagnóstico tricoscópico.',
    ben: ['Elimina grasa', 'Circulación', 'Anti-caspa', 'Oxigenación'],
    indicado: 'Graso, caída, pesadez',
    efecto: 'Frescor y volumen.',
  },
  {
    img: '/images/spa.jpg',
    tag: 'Relax',
    nombre: 'Head Spa',
    duracion: 'Ritual de bienestar',
    desc: 'Ritual de salud y relax con masaje profesional.',
    ben: ['Microcirculación', 'Nutre folículo', 'Anti-estrés', 'Crecimiento'],
    indicado: 'Caída, estrés, bienestar',
    efecto: 'Ligereza y equilibrio.',
  },
];

export function TratamientosSection() {
  const scrollToPrecios = () => document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="servicios" className="bg-[#F7F4F0] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Servicios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Tratamientos</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Adaptados a tu tipo de cabello</p>
        </div>

        <div className="flex flex-col gap-10 lg:gap-14">
          {tratamientos.map((t, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-5 md:gap-10 items-center`}
            >
              <div className="w-full md:w-[200px] lg:w-[240px] flex-shrink-0">
                <div className="relative h-[240px] md:h-[250px] lg:h-[240px] bg-[#e8e2da] overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.nombre}
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <ImgPlaceholder label={t.img.split('/').pop() || ''} />
                  <div className="absolute top-2 left-2 bg-[#3d3530] text-white text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 z-20">
                    {t.tag}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-1">{t.duracion}</p>
                  <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#3d3530] mb-1">{t.nombre}</h3>
                  <p className="text-[#7a6f68] text-sm md:text-base">{t.desc}</p>
                </div>

                <ul className="grid grid-cols-2 gap-1.5">
                  {t.ben.map((b, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-xs md:text-sm text-[#7a6f68]">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 text-xs md:text-sm">
                  <div className="flex-1 bg-white px-3 py-2">
                    <p className="text-[9px] tracking-widest uppercase text-[#B8A99A] mb-0.5">Indicado</p>
                    <p className="text-[#3d3530]">{t.indicado}</p>
                  </div>
                  <div className="flex-1 bg-white px-3 py-2">
                    <p className="text-[9px] tracking-widest uppercase text-[#B8A99A] mb-0.5">Efecto</p>
                    <p className="text-[#3d3530]">{t.efecto}</p>
                  </div>
                </div>

                <button
                  onClick={scrollToPrecios}
                  className="self-start px-6 py-2 border border-[#B8A99A] text-[#B8A99A] text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all cursor-pointer"
                >
                  Ver precio
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. TABLA DE PRECIOS
// ═══════════════════════════════════════════════════════════════

const precios = [
  { l: '20–30 cm', k: '180€', r: '150€', desc: 'Debajo de la oreja' },
  { l: '30–40 cm', k: '200€', r: '165€', desc: 'Hombros' },
  { l: '40–50 cm', k: '220€', r: '180€', desc: 'Mitad espalda' },
  { l: '50–60 cm', k: '240€', r: '200€', desc: 'Cintura' },
  { l: '60–70 cm', k: '260€', r: '220€', desc: 'Bajo cintura' },
  { l: '70–80 cm', k: '280€', r: '240€', desc: 'Cadera' },
];

export function TablaDePreciosSection() {
  const [tab, setTab] = useState<'k' | 'r'>('k');
  const [selected, setSelected] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const { requireAuth } = useRequireAuth();
  const navigate = useNavigate();

  return (
    <section id="precios" className="bg-[#FEFEFE] py-16 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Precios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Tabla de Precios</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Toca una longitud para destacar el precio</p>
        </div>

        <div className="flex border-b border-[#e8e2da] mb-6">
          {[['k', 'Keratina / Botox'], ['r', 'Reconstrucción']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => {
                setTab(v as 'k' | 'r');
                setSelected(null);
              }}
              className={`pb-3 px-4 md:px-6 text-[12px] tracking-[0.12em] uppercase transition-all ${
                tab === v
                  ? 'border-b-2 border-[#B8A99A] text-[#3d3530] font-medium'
                  : 'text-[#a09890]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-[#f0ebe4]">
          {precios.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelected(i === selected ? null : i)}
              className={`flex justify-between items-center py-3.5 px-3 text-left transition-all cursor-pointer ${
                selected === i ? 'bg-[#B8A99A]/10 border-l-2 border-[#B8A99A]' : 'hover:bg-[#FAF8F5]'
              }`}
            >
              <div>
                <span className="text-sm md:text-base text-[#3d3530] font-medium">{p.l}</span>
                <span className="text-[10px] text-[#a09890] ml-2">{p.desc}</span>
              </div>
              <span
                className={`font-serif text-lg md:text-xl transition-all ${
                  selected === i ? 'text-[#B8A99A] scale-110' : 'text-[#3d3530]'
                }`}
              >
                {tab === 'k' ? p.k : p.r}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 bg-[#FAF8F5] px-4 py-3 text-xs md:text-sm text-[#7a6f68] space-y-1">
          <p>
            <span className="text-[#3d3530] font-medium">Abundante:</span> +20€ (7cm) · +40€ (9cm) · +60€ (10+cm)
          </p>
          <p>
            <span className="text-[#3d3530] font-medium">Extras:</span> Peeling +65€ · Nano Gold +50€ · Corte +20€
          </p>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-start">
          <button
            onClick={() => requireAuth(() => navigate('/booking'))}
            className="px-8 py-3 bg-[#B8A99A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors cursor-pointer"
          >
            Reservar cita
          </button>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-6 py-3 border border-[#e8e2da] text-[#8B7355] text-[11px] tracking-[0.15em] uppercase hover:border-[#B8A99A] transition-colors cursor-pointer flex items-center gap-2"
          >
            <svg
              className={`w-3 h-3 transition-transform ${showGuide ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showGuide ? 'Ocultar guía' : 'Ver guía de longitud'}
          </button>
        </div>

        {showGuide && (
          <div className="mt-4 flex justify-center animate-fade-in-up">
            <div className="relative bg-[#f0ebe4] overflow-hidden max-w-[200px]">
              <img
                src="/images/precios.jpg"
                alt="Guía de longitud"
                className="w-full object-contain relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <ImgPlaceholder label="precios.jpg" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. ANTES & DESPUÉS
// ═══════════════════════════════════════════════════════════════

const adFotos = [
  { img: '/images/beforeafter1.jpg', link: 'https://www.instagram.com/keratin_madrid' },
  { img: '/images/beforeafter2.jpg', link: 'https://www.instagram.com/keratin_madrid' },
  { img: '/images/beforeafter3.jpeg', link: 'https://www.instagram.com/keratin_madrid' },
];

export function AntesDespuesSection() {
  return (
    <section id="resultados" className="bg-[#F5F1EC] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Resultados</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Antes / Después</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-4xl mx-auto">
          {adFotos.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[4/3] bg-[#e8e2da] overflow-hidden group block"
            >
              <img
                src={item.img}
                alt={`Resultado ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <ImgPlaceholder label={item.img.split('/').pop() || ''} />
            </a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://www.instagram.com/keratin_madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] tracking-[0.2em] uppercase text-[#8B7355] border-b border-[#B8A99A] pb-1 hover:text-[#3d3530]"
          >
            Ver más en Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. OPINIONES
// ═══════════════════════════════════════════════════════════════

const resenasEstaticas = [
  { nombre: 'Ana M.', estrellas: 5, texto: 'Resultado increíble desde la primera sesión. Brillante y sin frizz.' },
  { nombre: 'Laura P.', estrellas: 5, texto: 'Llevo dos años y cada vez mejor. El trato es excelente.' },
  { nombre: 'Sofía R.', estrellas: 5, texto: 'Pelo muy dañado — la reconstrucción lo cambió completamente.' },
  { nombre: 'María G.', estrellas: 5, texto: 'El Head Spa fue maravilloso. Completamente relajada.' },
  { nombre: 'Elena T.', estrellas: 5, texto: 'Vine por recomendación. Todo muy profesional.' },
  { nombre: 'Carmen V.', estrellas: 5, texto: 'El kit de homecare alargó el resultado mucho más.' },
];

export function ReviewsSection() {
  const { user, requireAuth } = useRequireAuth();
  const [form, setForm] = useState({ nombre: '', texto: '', estrellas: 5 });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.name) setForm((f) => ({ ...f, nombre: user.name }));
  }, [user]);

  const handleSubmit = () => {
    requireAuth(async () => {
      if (!form.nombre.trim() || !form.texto.trim()) {
        setError('Completa nombre y experiencia.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        await createReviewAPI(form);
        setSent(true);
      } catch {
        setError('Error al enviar.');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <section id="opiniones" className="bg-[#FAF9F7] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Testimonios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">
            Lo que dicen nuestras clientas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {resenasEstaticas.map((r, i) => (
            <div key={i} className="flex flex-col gap-2 p-5 bg-[#FAF8F5] border border-[#f0ebe4]">
              <div className="flex gap-0.5">
                {[...Array(r.estrellas)].map((_, j) => (
                  <span key={j} className="text-[#B8A99A] text-sm">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-[#3d3530] text-sm leading-relaxed flex-1 italic font-serif">"{r.texto}"</p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#8B7355]">{r.nombre}</p>
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#a09890] text-center mb-5">
            Comparte tu experiencia
          </p>

          {sent ? (
            <div className="text-center py-6 bg-[#FAF8F5] border border-[#f0ebe4]">
              <p className="text-[#8B7355] font-serif text-lg mb-1">¡Gracias por tu reseña!</p>
              <p className="text-sm text-[#a09890]">Será revisada y publicada pronto.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm((f) => ({ ...f, estrellas: n }))}
                    className={`text-xl ${n <= form.estrellas ? 'text-[#B8A99A]' : 'text-[#e8e2da]'}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm focus:outline-none focus:border-[#B8A99A]"
              />

              <textarea
                rows={3}
                placeholder="Tu experiencia..."
                value={form.texto}
                onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm focus:outline-none focus:border-[#B8A99A] resize-none"
              />

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2.5 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar reseña'}
              </button>

              {!user && <p className="text-[10px] text-[#a09890] text-center">Necesitas iniciar sesión para enviar.</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. HOMECARE + PRODUCTOS
// ═══════════════════════════════════════════════════════════════

const pasos = [
  'Champú adaptado según necesidad',
  'Mascarilla 1–2×/sem (20–30 min)',
  'Acondicionador en días sin mascarilla',
  'Termoprotector antes de secar',
  'Secador en aire tibio o frío',
  'Cepillo con púas suaves',
  'No dormir con pelo mojado',
  'Evitar agua muy caliente',
];

export function HomecareSection() {
  const { requireAuth } = useRequireAuth();
  const [showKitModal, setShowKitModal] = useState(false);

  return (
    <section id="homecare" className="bg-[#F3EFE9] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Homecare</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Cuidado en casa</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          <div className="flex-1">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {pasos.map((paso, i) => (
                <li key={i} className="flex items-start gap-2 py-1.5 border-b border-[#ede8e2]">
                  <span className="flex-shrink-0 w-5 h-5 border border-[#d4cfc9] flex items-center justify-center text-[9px] text-[#B8A99A] mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm md:text-base text-[#3d3530]">{paso}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-l-2 border-[#B8A99A] pl-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8A99A] mb-2">Nota de la especialista</p>
              <p className="font-serif text-base md:text-lg text-[#3d3530] italic">
                "El salón hace el 50%. El otro 50% lo haces tú en casa."
              </p>
            </div>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0" id="productos">
            <div className="relative h-[300px] md:h-[250px] bg-[#e8e2da] overflow-hidden">
              <img
                src="/images/kit.jpg"
                alt="Kit"
                className="w-full h-full object-contain relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <ImgPlaceholder label="kit.jpg" />
            </div>

            <div className="bg-white p-5 border border-[#e8e2da]">
              <p className="text-[10px] tracking-widest uppercase text-[#B8A99A] mb-1">Productos</p>
              <h3 className="font-serif text-lg text-[#3d3530] mb-2">Kit personalizado</h3>
              <p className="text-xs text-[#7a6f68] mb-3">Champú · Acondicionador · Mascarilla · Protector térmico.</p>
              <p className="font-serif text-xl text-[#3d3530] mb-3">90€</p>

              <button
                onClick={() => requireAuth(() => setShowKitModal(true))}
                className="block w-full text-center py-2.5 bg-[#B8A99A] text-white text-[10px] tracking-widest uppercase hover:bg-[#9A8B7A] cursor-pointer"
              >
                Reservar kit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={showKitModal}
        onClose={() => setShowKitModal(false)}
        type="kit"
        title="Reservar Kit"
        detalleLabel="Tipo de cabello"
        detallePlaceholder="Liso, rizado, dañado..."
        successMessage="¡Kit reservado!"
      />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7. FORMACIONES
// ═══════════════════════════════════════════════════════════════

export function FormacionesSection() {
  const { requireAuth } = useRequireAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedFormacion, setSelectedFormacion] = useState('');

  const handleReservar = (f: string) => {
    requireAuth(() => {
      setSelectedFormacion(f);
      setShowModal(true);
    });
  };

  return (
    <section id="formaciones" className="bg-[#FDFCFA] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Para Profesionales</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Formaciones</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-10 max-w-2xl mx-auto">
          {['/images/formaciones.jpeg', '/images/formaciones2.jpeg', '/images/formaciones3.jpeg'].map((src, i) => (
            <div key={i} className="relative aspect-[4/3] bg-[#f0ebe4] overflow-hidden">
              <img
                src={src}
                alt={`Formación ${i + 1}`}
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <ImgPlaceholder label={src.split('/').pop() || ''} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="border border-[#e8e2da] p-6 md:p-8 flex flex-col gap-4">
            <span className="self-start text-[10px] tracking-[0.2em] uppercase text-white bg-[#3d3530] px-3 py-1">
              Curso destacado
            </span>
            <h3 className="font-serif text-xl md:text-2xl text-[#3d3530]">Curso intensivo de keratina</h3>
            <p className="text-sm text-[#8B7355]">2 días · Práctica con modelos</p>
            <p className="text-xs text-[#7a6f68]">
              <span className="text-[#3d3530]">Incluye:</span> Materiales · Manual · Fotos · Certificado
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-[#f0ebe4]">
              <span className="font-serif text-2xl text-[#3d3530]">1.400€</span>
              <button
                onClick={() => handleReservar('Curso intensivo de keratina')}
                className="px-5 py-2.5 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] cursor-pointer"
              >
                Reservar plaza
              </button>
            </div>
          </div>

          <div className="border border-[#e8e2da] p-6 md:p-8 flex flex-col gap-4">
            <span className="self-start text-[10px] tracking-[0.2em] uppercase text-white bg-[#8B7355] px-3 py-1">
              Masterclass
            </span>
            <h3 className="font-serif text-xl md:text-2xl text-[#3d3530]">Reconstrucción en Frío</h3>
            <p className="text-sm text-[#8B7355]">Intensivo · Máx. 6 personas</p>
            <p className="text-xs text-[#7a6f68]">
              <span className="text-[#3d3530]">Incluye:</span> Materiales · Guía · Certificado
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-[#f0ebe4]">
              <div>
                <span className="font-serif text-2xl text-[#3d3530]">350€</span>
                <span className="text-xs text-[#8B7355] block">por persona · mín. 3</span>
              </div>
              <button
                onClick={() => handleReservar('Masterclass Reconstrucción')}
                className="px-5 py-2.5 border border-[#B8A99A] text-[#B8A99A] text-[11px] tracking-widest uppercase hover:bg-[#B8A99A] hover:text-white cursor-pointer"
              >
                Reservar plaza
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="formacion"
        title="Reservar plaza"
        detalleLabel="Formación"
        detallePlaceholder={selectedFormacion}
        successMessage="¡Plaza reservada!"
      />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8. BEAUTY SCRIPTS
// ═══════════════════════════════════════════════════════════════

const STRIPE_SCRIPTS_URL = 'https://buy.stripe.com/TU_STRIPE_LINK_AQUI';

export function BeautyScriptsSection() {
  return (
    <section id="scripts" className="bg-[#F5F2ED] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14 lg:text-left">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Scripts</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-4">Beauty Scripts</h2>
          <p className="text-base md:text-lg text-[#7a6f68] max-w-2xl lg:mx-0 mx-auto">
            Scripts listos para usar que aumentan tus ventas. Diálogos profesionales para especialistas capilares.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
          <div className="w-full max-w-xs lg:w-[300px] flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative aspect-[4/5] bg-[#f0ebe4] overflow-hidden">
              <img
                src="/images/beautyscripts.jpeg"
                alt="Beauty Scripts"
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <ImgPlaceholder label="beautyscripts.jpeg" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              {[
                ['Ahorra tiempo', 'Scripts probados y listos para usar.'],
                ['Reduce estrés', 'Responde con confianza a cualquier pregunta.'],
                ['Más conversiones', 'Optimizados para cerrar más ventas.'],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-3">
                  <span className="w-5 h-5 border border-[#B8A99A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-[#B8A99A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-base md:text-lg font-medium text-[#3d3530]">{t}</p>
                    <p className="text-sm md:text-base text-[#8B7355]">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={STRIPE_SCRIPTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start px-8 py-3.5 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors"
            >
              Quiero los Scripts
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}