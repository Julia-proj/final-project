import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import { createReservationAPI } from '../api/reservations.api';

// ── Placeholder ──────────────────────────────────────────────
function ImgPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5F1EC]">
      <svg className="w-6 h-6 text-[#D4C8BA] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="text-[9px] tracking-widest uppercase text-[#D4C8BA]">{label}</span>
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
      setError('Nombre y telefono son obligatorios.');
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
      <div className="fixed inset-0 bg-[#2D2A26]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white max-w-md w-full p-8 shadow-xl z-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#9A938A] hover:text-[#2D2A26] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="font-serif text-2xl text-[#2D2A26] mb-6">{title}</h3>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 border border-[#C4A484] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#C4A484]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[#8B7355] mb-2 font-serif text-lg">{successMessage}</p>
            <p className="text-sm text-[#9A938A]">Te contactaremos pronto.</p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-[#C4A484] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#8B7355] mb-2 block">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="input-elegant"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#8B7355] mb-2 block">Telefono *</label>
              <input
                type="tel"
                value={form.telefono}
                placeholder="+34 6XX XXX XXX"
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                className="input-elegant"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#8B7355] mb-2 block">
                {detalleLabel}
              </label>
              <input
                type="text"
                value={form.detalle}
                placeholder={detallePlaceholder}
                onChange={(e) => setForm((f) => ({ ...f, detalle: e.target.value }))}
                className="input-elegant"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#8B7355] mb-2 block">
                Notas (opcional)
              </label>
              <textarea
                rows={2}
                value={form.notas}
                placeholder="Comentarios..."
                onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
                className="input-elegant resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-[#C4A484] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#8B7355] disabled:opacity-50 transition-colors mt-2"
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
// 1. POR QUE ELEGIR
// ═══════════════════════════════════════════════════════════════

const beneficios = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="m21 21-4.35-4.35" />
      </svg>
    ),
    titulo: 'Diagnostico con tricoscopo',
    texto: 'Analizamos cabello y cuero cabelludo antes de elegir protocolo.',
    accent: '#C4A484',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
        />
      </svg>
    ),
    titulo: 'Protocolos exclusivos',
    texto: 'Tecnologia premium anti-dano. Formulas seguras.',
    accent: '#8B7355',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    ),
    titulo: 'Servicio de alto nivel',
    texto: 'Atencion personalizada y cuidado en cada detalle.',
    accent: '#C4A484',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    ),
    titulo: 'Seguimiento y cuidado',
    texto: 'Plan claro para prolongar resultados al maximo.',
    accent: '#8B7355',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    titulo: 'Correccion de habitos',
    texto: 'Ajustamos habitos sencillos que marcan la diferencia.',
    accent: '#C4A484',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
    titulo: 'Resultados duraderos',
    texto: 'Trabajamos para meses, no para un dia.',
    accent: '#8B7355',
  },
];

export function PorQueElegirSection() {
  return (
    <section id="inicio" className="bg-[#FAF8F6] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 lg:mb-18">
          <p className="section-label">Beneficios</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[42px] mb-5">
            Por que elegir Keratin Madrid
          </h2>
          <p className="section-subtitle text-base md:text-lg max-w-lg mx-auto">
            Nos diferenciamos por la salud capilar y resultados duraderos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {beneficios.map((b, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 bg-white border border-[#E8E4DF] hover:border-[#D4C8BA] transition-all duration-300"
            >
              <div 
                className="w-10 h-10 flex items-center justify-center"
                style={{ color: b.accent }}
              >
                {b.icon}
              </div>
              <h3 className="font-serif text-lg text-[#2D2A26]">{b.titulo}</h3>
              <p className="text-[#6B635A] text-sm leading-relaxed">{b.texto}</p>
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
    duracion: '3-6 meses',
    desc: 'Alisado seguro, sin formol. Adaptado al diagnostico previo.',
    ben: ['Reduce frizz', 'Brillo espejo', 'Mas disciplina', 'Ahorra tiempo'],
    indicado: 'Rizados, encrespados, rebeldes',
    efecto: 'Liso y manejable 3-6 meses.',
  },
  {
    img: '/images/reconstruccion.jpg',
    tag: 'Reparador',
    nombre: 'Reconstruccion en frio',
    duracion: 'Acumulativo',
    desc: 'Recuperacion profunda sin alisar. Restaura fuerza y elasticidad.',
    ben: ['Proteinas', 'Reduce rotura', 'Mejora brillo', 'Compatible decoloraciones'],
    indicado: 'Seco, danado, decolorado',
    efecto: 'Mas fuerte, resultado acumulativo.',
  },
  {
    img: '/images/peeling.jpg',
    tag: 'Detox',
    nombre: 'Peeling Capilar',
    duracion: 'Limpieza + diagnostico',
    desc: 'Limpieza profunda con diagnostico tricoscopico.',
    ben: ['Elimina grasa', 'Circulacion', 'Anti-caspa', 'Oxigenacion'],
    indicado: 'Graso, caida, pesadez',
    efecto: 'Frescor y volumen.',
  },
  {
    img: '/images/spa.jpg',
    tag: 'Relax',
    nombre: 'Head Spa',
    duracion: 'Ritual de bienestar',
    desc: 'Ritual de salud y relax con masaje profesional.',
    ben: ['Microcirculacion', 'Nutre foliculo', 'Anti-estres', 'Crecimiento'],
    indicado: 'Caida, estres, bienestar',
    efecto: 'Ligereza y equilibrio.',
  },
];

export function TratamientosSection() {
  const scrollToPrecios = () => document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="servicios" className="bg-[#F5F1EC] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 lg:mb-18">
          <p className="section-label">Servicios</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[42px] mb-5">Tratamientos</h2>
          <p className="section-subtitle text-base md:text-lg">Adaptados a tu tipo de cabello</p>
        </div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {tratamientos.map((t, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-10 items-center`}
            >
              <div className="w-full md:w-[220px] lg:w-[260px] flex-shrink-0">
                <div className="relative aspect-[4/5] max-w-[220px] md:max-w-none mx-auto bg-[#EDE8E2] overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.nombre}
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <ImgPlaceholder label={t.img.split('/').pop() || ''} />
                  <div className="absolute top-3 left-3 bg-[#2D2A26] text-white text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 z-20">
                    {t.tag}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#C4A484] mb-2">{t.duracion}</p>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#2D2A26] mb-2">{t.nombre}</h3>
                  <p className="text-[#6B635A] text-sm md:text-base">{t.desc}</p>
                </div>

                <ul className="grid grid-cols-2 gap-2">
                  {t.ben.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#6B635A]">
                      <span className="mt-2 w-1 h-1 rounded-full bg-[#C4A484] flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 text-sm">
                  <div className="flex-1 bg-white px-4 py-3 border border-[#E8E4DF]">
                    <p className="text-[9px] tracking-[0.15em] uppercase text-[#C4A484] mb-1">Indicado</p>
                    <p className="text-[#2D2A26] text-sm">{t.indicado}</p>
                  </div>
                  <div className="flex-1 bg-white px-4 py-3 border border-[#E8E4DF]">
                    <p className="text-[9px] tracking-[0.15em] uppercase text-[#C4A484] mb-1">Efecto</p>
                    <p className="text-[#2D2A26] text-sm">{t.efecto}</p>
                  </div>
                </div>

                <button
                  onClick={scrollToPrecios}
                  className="self-start px-6 py-2.5 border border-[#C4A484] text-[#C4A484] text-[10px] tracking-[0.15em] uppercase hover:bg-[#C4A484] hover:text-white transition-all cursor-pointer"
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
  { l: '20-30 cm', k: '180 EUR', r: '150 EUR', desc: 'Debajo de la oreja' },
  { l: '30-40 cm', k: '200 EUR', r: '165 EUR', desc: 'Hombros' },
  { l: '40-50 cm', k: '220 EUR', r: '180 EUR', desc: 'Mitad espalda' },
  { l: '50-60 cm', k: '240 EUR', r: '200 EUR', desc: 'Cintura' },
  { l: '60-70 cm', k: '260 EUR', r: '220 EUR', desc: 'Bajo cintura' },
  { l: '70-80 cm', k: '280 EUR', r: '240 EUR', desc: 'Cadera' },
];

export function TablaDePreciosSection() {
  const [tab, setTab] = useState<'k' | 'r'>('k');
  const [selected, setSelected] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const { requireAuth } = useRequireAuth();
  const navigate = useNavigate();

  return (
    <section id="precios" className="bg-[#FAF8F6] py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-label">Precios</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[42px] mb-5">Tabla de Precios</h2>
          <p className="section-subtitle text-base md:text-lg">Toca una longitud para destacar el precio</p>
        </div>

        <div className="flex border-b border-[#E8E4DF] mb-8">
          {[['k', 'Keratina / Botox'], ['r', 'Reconstruccion']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => {
                setTab(v as 'k' | 'r');
                setSelected(null);
              }}
              className={`pb-4 px-5 md:px-8 text-[11px] tracking-[0.12em] uppercase transition-all ${
                tab === v
                  ? 'border-b-2 border-[#C4A484] text-[#2D2A26] font-medium'
                  : 'text-[#9A938A]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-[#F5F1EC]">
          {precios.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelected(i === selected ? null : i)}
              className={`flex justify-between items-center py-4 px-4 text-left transition-all cursor-pointer ${
                selected === i ? 'bg-[#C4A484]/8 border-l-2 border-[#C4A484]' : 'hover:bg-[#F5F1EC]'
              }`}
            >
              <div>
                <span className="text-sm md:text-base text-[#2D2A26] font-medium">{p.l}</span>
                <span className="text-[10px] text-[#9A938A] ml-3">{p.desc}</span>
              </div>
              <span
                className={`font-serif text-lg md:text-xl transition-all ${
                  selected === i ? 'text-[#C4A484] scale-105' : 'text-[#2D2A26]'
                }`}
              >
                {tab === 'k' ? p.k : p.r}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 bg-[#F5F1EC] px-5 py-4 text-sm text-[#6B635A] space-y-2">
          <p>
            <span className="text-[#2D2A26] font-medium">Abundante:</span> +20 EUR (7cm) / +40 EUR (9cm) / +60 EUR (10+cm)
          </p>
          <p>
            <span className="text-[#2D2A26] font-medium">Extras:</span> Peeling +65 EUR / Nano Gold +50 EUR / Corte +20 EUR
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start">
          <button
            onClick={() => requireAuth(() => navigate('/booking'))}
            className="px-8 py-3.5 bg-[#C4A484] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors cursor-pointer"
          >
            Reservar cita
          </button>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-6 py-3.5 border border-[#E8E4DF] text-[#8B7355] text-[10px] tracking-[0.12em] uppercase hover:border-[#C4A484] transition-colors cursor-pointer flex items-center gap-2"
          >
            <svg
              className={`w-3 h-3 transition-transform ${showGuide ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showGuide ? 'Ocultar guia' : 'Ver guia de longitud'}
          </button>
        </div>

        {showGuide && (
          <div className="mt-6 flex justify-center animate-fade-in-up">
            <div className="relative bg-[#F5F1EC] overflow-hidden max-w-[180px]">
              <img
                src="/images/precios.jpg"
                alt="Guia de longitud"
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
// 4. ANTES Y DESPUES (Video Carousel)
// ═══════════════════════════════════════════════════════════════

const reelsVideos = [
  { id: 1, thumb: '/images/beforeafter1.jpg', link: 'https://www.instagram.com/keratin_madrid' },
  { id: 2, thumb: '/images/beforeafter2.jpg', link: 'https://www.instagram.com/keratin_madrid' },
  { id: 3, thumb: '/images/beforeafter3.jpeg', link: 'https://www.instagram.com/keratin_madrid' },
  { id: 4, thumb: '/images/beforeafter1.jpg', link: 'https://www.instagram.com/keratin_madrid' },
];

export function AntesDespuesSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.children[0]?.clientWidth || 280;
      carouselRef.current.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.children[0]?.clientWidth || 280;
      const newIndex = Math.round(carouselRef.current.scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  return (
    <section id="resultados" className="bg-[#EDE8E2] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-label">Resultados</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[42px] mb-5">Antes / Despues</h2>
          <p className="section-subtitle text-base md:text-lg">Mira nuestras transformaciones en Instagram</p>
        </div>

        {/* Video Carousel */}
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {reelsVideos.map((video, i) => (
            <a
              key={video.id}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] aspect-[9/16] bg-[#F5F1EC] overflow-hidden group snap-center"
            >
              <img
                src={video.thumb}
                alt={`Resultado ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <ImgPlaceholder label={`Reel ${i + 1}`} />
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#2D2A26] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              {/* Instagram icon */}
              <div className="absolute bottom-3 right-3 z-20">
                <svg className="w-5 h-5 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Carousel dots */}
        <div className="flex justify-center gap-2 mt-6">
          {reelsVideos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === i ? 'bg-[#C4A484] w-6' : 'bg-[#D4C8BA]'
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/keratin_madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#8B7355] hover:text-[#2D2A26] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
            Ver mas en Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. OPINIONES (Reviews with Screenshots Grid + Feedback Form)
// ═══════════════════════════════════════════════════════════════

const reviewScreenshots = [
  '/images/review1.jpg',
  '/images/review2.jpg',
  '/images/review3.jpg',
  '/images/review4.jpg',
  '/images/review5.jpg',
  '/images/review6.jpg',
];

export function ReviewsSection() {
  const [feedbackForm, setFeedbackForm] = useState({ sugerencia: '', comentario: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedbackSubmit = () => {
    if (feedbackForm.sugerencia.trim() || feedbackForm.comentario.trim()) {
      setFeedbackSent(true);
    }
  };

  return (
    <section id="opiniones" className="bg-[#FAF8F6] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-label">Testimonios</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[42px] mb-5">
            Lo que dicen nuestras clientas
          </h2>
        </div>

        {/* Review Screenshots Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-16 max-w-4xl mx-auto">
          {reviewScreenshots.map((src, i) => (
            <div key={i} className="relative aspect-[4/5] bg-[#F5F1EC] overflow-hidden">
              <img
                src={src}
                alt={`Resena ${i + 1}`}
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <ImgPlaceholder label={`Review ${i + 1}`} />
            </div>
          ))}
        </div>

        {/* Feedback Block */}
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <p className="font-serif text-xl text-[#2D2A26] mb-2">Tu opinion nos importa</p>
            <p className="text-sm text-[#6B635A]">Comparte tus sugerencias o comentarios para mejorar</p>
          </div>

          {feedbackSent ? (
            <div className="text-center py-10 bg-[#F5F1EC] border border-[#E8E4DF]">
              <div className="w-12 h-12 mx-auto mb-4 border border-[#C4A484] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#C4A484]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-serif text-lg text-[#8B7355] mb-1">Gracias por tu opinion</p>
              <p className="text-sm text-[#9A938A]">Tu comentario nos ayuda a mejorar.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 bg-[#F5F1EC] p-6 border border-[#E8E4DF]">
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#8B7355] mb-2 block">
                  Sugerencia
                </label>
                <input
                  type="text"
                  placeholder="Como podemos mejorar?"
                  value={feedbackForm.sugerencia}
                  onChange={(e) => setFeedbackForm((f) => ({ ...f, sugerencia: e.target.value }))}
                  className="input-elegant"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#8B7355] mb-2 block">
                  Comentario
                </label>
                <textarea
                  rows={3}
                  placeholder="Tu experiencia o mensaje..."
                  value={feedbackForm.comentario}
                  onChange={(e) => setFeedbackForm((f) => ({ ...f, comentario: e.target.value }))}
                  className="input-elegant resize-none"
                />
              </div>

              <button
                onClick={handleFeedbackSubmit}
                className="w-full py-3 bg-[#C4A484] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors"
              >
                Enviar opinion
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. HOMECARE + PRODUCTOS (with Personalized Care Block)
// ═══════════════════════════════════════════════════════════════

const pasos = [
  'Champu adaptado segun necesidad',
  'Mascarilla 1-2x/sem (20-30 min)',
  'Acondicionador en dias sin mascarilla',
  'Termoprotector antes de secar',
  'Secador en aire tibio o frio',
  'Cepillo con puas suaves',
  'No dormir con pelo mojado',
  'Evitar agua muy caliente',
];

export function HomecareSection() {
  const { requireAuth } = useRequireAuth();
  const [showKitModal, setShowKitModal] = useState(false);

  return (
    <section id="homecare" className="bg-[#F5F1EC] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label">Homecare</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[42px] mb-5">Cuidado en casa</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Left: Tips */}
          <div className="flex-1">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {pasos.map((paso, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5 border-b border-[#E8E4DF]">
                  <span className="flex-shrink-0 w-6 h-6 border border-[#D4C8BA] flex items-center justify-center text-[10px] text-[#C4A484] mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[#2D2A26]">{paso}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-l-2 border-[#C4A484] pl-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#C4A484] mb-2">Nota de la especialista</p>
              <p className="font-serif text-lg text-[#2D2A26] italic">
                "El salon hace el 50%. El otro 50% lo haces tu en casa."
              </p>
            </div>
          </div>

          {/* Right: Kit + Personalized Care */}
          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-6" id="productos">
            {/* Kit Card */}
            <div className="bg-white border border-[#E8E4DF]">
              <div className="relative h-[200px] bg-[#EDE8E2] overflow-hidden">
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

              <div className="p-5">
                <p className="text-[9px] tracking-[0.15em] uppercase text-[#C4A484] mb-1">Productos</p>
                <h3 className="font-serif text-lg text-[#2D2A26] mb-2">Kit personalizado</h3>
                <p className="text-xs text-[#6B635A] mb-4">Champu / Acondicionador / Mascarilla / Protector termico.</p>
                <p className="font-serif text-xl text-[#2D2A26] mb-4">90 EUR</p>

                <button
                  onClick={() => requireAuth(() => setShowKitModal(true))}
                  className="block w-full text-center py-3 bg-[#C4A484] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors cursor-pointer"
                >
                  Reservar kit
                </button>
              </div>
            </div>

            {/* Personalized Care Bonus */}
            <div className="bg-[#2D2A26] p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 border border-[#C4A484] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#C4A484]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#C4A484] mb-2">Bonus exclusivo</p>
              <p className="font-serif text-white text-base mb-2">Diagnostico con tricoscopo gratis</p>
              <p className="text-xs text-[#9A938A]">
                Al reservar por la web, incluimos diagnostico personalizado del cuero cabelludo sin coste adicional.
              </p>
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
        detallePlaceholder="Liso, rizado, danado..."
        successMessage="Kit reservado!"
      />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7. FORMACIONES (with updated course info)
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
    <section id="formaciones" className="bg-[#FAF8F6] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label">Para Profesionales</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[42px] mb-5">Formaciones</h2>
        </div>

        {/* Course Images */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-12 max-w-2xl mx-auto">
          {['/images/formaciones.jpeg', '/images/formaciones2.jpeg', '/images/formaciones3.jpeg'].map((src, i) => (
            <div key={i} className="relative aspect-[4/3] bg-[#F5F1EC] overflow-hidden">
              <img
                src={src}
                alt={`Formacion ${i + 1}`}
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <ImgPlaceholder label={src.split('/').pop() || ''} />
            </div>
          ))}
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Intensive Keratin Course */}
          <div className="bg-white border border-[#E8E4DF] p-6 md:p-8 flex flex-col gap-4">
            <span className="self-start text-[9px] tracking-[0.15em] uppercase text-white bg-[#2D2A26] px-3 py-1">
              Curso destacado
            </span>
            <h3 className="font-serif text-xl md:text-2xl text-[#2D2A26]">Curso intensivo de keratina</h3>
            <div className="text-sm text-[#8B7355] space-y-1">
              <p>2 dias / Practica con modelos</p>
              <p>Incluye: Reconstruccion Inferiore</p>
              <p>Duracion: aprox. 3 horas</p>
            </div>
            <p className="text-xs text-[#6B635A]">
              <span className="text-[#2D2A26]">Incluye:</span> Materiales / Manual / Fotos / Certificado
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[#F5F1EC]">
              <span className="font-serif text-2xl text-[#2D2A26]">1.400 EUR</span>
              <button
                onClick={() => handleReservar('Curso intensivo de keratina')}
                className="px-5 py-2.5 bg-[#C4A484] text-white text-[10px] tracking-[0.12em] uppercase hover:bg-[#8B7355] transition-colors cursor-pointer"
              >
                Reservar plaza
              </button>
            </div>
          </div>

          {/* Reconstruction Masterclass */}
          <div className="bg-white border border-[#E8E4DF] p-6 md:p-8 flex flex-col gap-4">
            <span className="self-start text-[9px] tracking-[0.15em] uppercase text-white bg-[#8B7355] px-3 py-1">
              Masterclass
            </span>
            <h3 className="font-serif text-xl md:text-2xl text-[#2D2A26]">Reconstruccion en Frio</h3>
            <div className="text-sm text-[#8B7355] space-y-1">
              <p>Intensivo / Max. 6 personas</p>
              <p>Duracion: aprox. 3 horas</p>
            </div>
            <p className="text-xs text-[#6B635A]">
              <span className="text-[#2D2A26]">Incluye:</span> Materiales / Guia / Certificado
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#F5F1EC] gap-3">
              <div>
                <span className="font-serif text-2xl text-[#2D2A26]">350 EUR</span>
                <span className="text-xs text-[#8B7355] block">por persona / min. 3 personas</span>
                <span className="text-[10px] text-[#9A938A]">Fecha se coordina al formar grupo</span>
              </div>
              <button
                onClick={() => handleReservar('Masterclass Reconstruccion')}
                className="px-5 py-2.5 border border-[#C4A484] text-[#C4A484] text-[10px] tracking-[0.12em] uppercase hover:bg-[#C4A484] hover:text-white transition-colors cursor-pointer"
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
        detalleLabel="Formacion"
        detallePlaceholder={selectedFormacion}
        successMessage="Plaza reservada!"
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
    <section id="scripts" className="bg-[#EDE8E2] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left mb-12">
          <p className="section-label">Scripts</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[42px] mb-4">Beauty Scripts</h2>
          <p className="section-subtitle text-base md:text-lg max-w-2xl lg:mx-0 mx-auto">
            Scripts listos para usar que aumentan tus ventas. Dialogos profesionales para especialistas capilares.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
          {/* Image */}
          <div className="w-full max-w-[260px] lg:w-[280px] flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative aspect-[4/5] bg-[#F5F1EC] overflow-hidden">
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

          {/* Content */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-5">
              {[
                ['Ahorra tiempo', 'Scripts probados y listos para usar.'],
                ['Reduce estres', 'Responde con confianza a cualquier pregunta.'],
                ['Mas conversiones', 'Optimizados para cerrar mas ventas.'],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-4">
                  <span className="w-6 h-6 border border-[#C4A484] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#C4A484]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-base md:text-lg font-medium text-[#2D2A26]">{t}</p>
                    <p className="text-sm text-[#6B635A]">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={STRIPE_SCRIPTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start px-8 py-3.5 bg-[#C4A484] text-white text-[11px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors"
            >
              Quiero los Scripts
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
