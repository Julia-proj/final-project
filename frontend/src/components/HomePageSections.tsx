import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import { createReviewAPI } from '../api/reviews.api';
import { createReservationAPI, createPublicReservationAPI } from '../api/reservations.api';

const StripeCheckoutModal = lazy(() => import('./StripeCheckoutModal'));

// ── Scroll-triggered reveal hook ─────────────────────────────
function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold, rootMargin: '0px 0px -40px 0px' });
    // Observe the element and all children with reveal classes
    const revealEls = el.querySelectorAll('.reveal, .reveal-fade, .reveal-scale');
    revealEls.forEach((child) => observer.observe(child));
    if (el.classList.contains('reveal') || el.classList.contains('reveal-fade') || el.classList.contains('reveal-scale')) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  return ref;
}

// ── Placeholder ──────────────────────────────────────────────
function ImgPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f0ebe4] z-0">
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
      <div className="relative bg-white max-w-md w-full p-8 shadow-xl z-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 text-[#a09890] hover:text-[#3d3530] text-2xl font-light">
          ✕
        </button>
        <h3 className="font-serif text-2xl text-[#3d3530] mb-8 font-light">{title}</h3>

        {sent ? (
          <div className="text-center py-8">
            <p className="text-[#8B7355] mb-3 font-light text-lg">✅ {successMessage}</p>
            <p className="text-base text-[#a09890] font-light mb-6">Te contactaremos pronto.</p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase font-light hover:bg-[#9A8B7A]"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Teléfono *</label>
              <input
                type="tel"
                value={form.telefono}
                placeholder="+34 6XX XXX XXX"
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">
                {detalleLabel}
              </label>
              <input
                type="text"
                value={form.detalle}
                placeholder={detallePlaceholder}
                onChange={(e) => setForm((f) => ({ ...f, detalle: e.target.value }))}
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">
                Notas (opcional)
              </label>
              <textarea
                rows={3}
                value={form.notas}
                placeholder="Comentarios..."
                onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A] resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-base font-light">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] disabled:opacity-50 font-light"
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
      </svg>
    ),
    titulo: 'Diagnóstico con tricóscopo',
    texto: 'Analizamos cabello y cuero cabelludo antes de elegir cualquier protocolo.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      </svg>
    ),
    titulo: 'Protocolos exclusivos',
    texto: 'Tecnología premium anti-daño y fórmulas seguras que no queman, no resecan y no dañan.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    titulo: 'Servicio de alto nivel',
    texto: 'Experiencia cómoda, atención a los detalles y trato personalizado.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
      </svg>
    ),
    titulo: 'Seguimiento y cuidado',
    texto: 'Plan claro para prolongar los resultados al máximo.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
      </svg>
    ),
    titulo: 'Corrección de hábitos',
    texto: 'Ajustamos hábitos sencillos que marcan la diferencia.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
    titulo: 'Cabello más fuerte',
    texto: 'Trabajamos para meses, no para un día. Resultados duraderos y acumulativos.',
  },
];

export function PorQueElegirSection() {
  const sectionRef = useReveal();
  return (
    <section id="inicio" className="bg-white py-10 lg:py-16" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14 reveal">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#8B7355] mb-4 font-medium">Beneficios</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#3d3530] mb-5 font-light tracking-wide">
            ¿Por qué Keratin Madrid?
          </h2>
          <p className="text-[#8B7355] text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Nos diferenciamos por nuestro enfoque en la salud capilar y resultados duraderos.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Salon photo */}
          <div className="w-full lg:w-[440px] xl:w-[500px] flex-shrink-0">
            <div className="relative aspect-[3/4] bg-[#f0ebe4] overflow-hidden">
              <img
                src="/images/salon.jpg"
                alt="Salón Keratin Madrid"
                className="w-full h-full object-cover relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <ImgPlaceholder label="salon.jpg" />
            </div>
          </div>

          {/* Right: Benefits grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              {beneficios.map((b, i) => (
                <div key={i} className="bg-white border border-[#ede8e2] p-5 lg:p-6 hover:shadow-md hover:border-[#c9bdb5] transition-all duration-300">
                  <div className="w-9 h-9 bg-[#F5F1EC] flex items-center justify-center text-[#8B7355] mb-3">
                    {b.icon}
                  </div>
                  <h3 className="text-[#3d3530] text-base font-medium mb-1.5 leading-snug">{b.titulo}</h3>
                  <p className="text-[#7a6f68] text-sm leading-relaxed">{b.texto}</p>
                </div>
              ))}
            </div>
          </div>
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
  const sectionRef = useReveal();
  const scrollToPrecios = () => document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="servicios" className="bg-[#F5F4F1] py-10 lg:py-16" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-18 reveal">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#8B7355] mb-4 font-medium">Servicios</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#3d3530] mb-6 font-light tracking-wide">Tratamientos</h2>
          <p className="text-[#8B7355] text-base md:text-lg lg:text-xl font-light">Adaptados a tu tipo de cabello y necesidades reales</p>
        </div>

        <div className="flex flex-col gap-10 lg:gap-16">
          {tratamientos.map((t, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 lg:gap-20 items-start md:items-center`}
            >
              <div className="w-full md:w-[300px] lg:w-[360px] xl:w-[400px] flex-shrink-0">
                <div className="relative h-[280px] md:h-[340px] bg-[#e8e2da] overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.nombre}
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <ImgPlaceholder label={t.img.split('/').pop() || ''} />
                  <div className="absolute top-4 left-4 bg-white/88 backdrop-blur-sm text-[#3b332e] text-[10px] tracking-[0.22em] uppercase px-3.5 py-1.5 z-20 font-medium shadow-sm">
                    {t.tag}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-7">
                <div>
                  <p className="text-[13px] tracking-[0.3em] uppercase text-[#B8A99A] mb-3 font-light">{t.duracion}</p>
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#3d3530] mb-4 font-light">{t.nombre}</h3>
                  <p className="text-[#7a6f68] text-sm leading-relaxed">{t.desc}</p>
                </div>

                <ul className="grid grid-cols-2 gap-4 md:gap-5">
                  {t.ben.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-[#7a6f68]">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B8A99A] flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-4 text-base md:text-lg">
                  <div className="flex-1 bg-[#FDFCFA] border border-[#e8e2da] px-5 py-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#BCA590] mb-1.5">Indicado</p>
                    <p className="text-sm text-[#3b332e]">{t.indicado}</p>
                  </div>
                  <div className="flex-1 bg-[#FDFCFA] border border-[#e8e2da] px-5 py-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#BCA590] mb-1.5">Efecto</p>
                    <p className="text-sm text-[#3b332e]">{t.efecto}</p>
                  </div>
                </div>

                <button
                  onClick={scrollToPrecios}
                  className="self-start px-10 py-3.5 bg-[#3d3530] text-white text-[13px] tracking-[0.2em] uppercase hover:bg-[#2d2520] transition-all cursor-pointer font-medium"
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
// 3. ANTES & DESPUÉS
// ═══════════════════════════════════════════════════════════════

const adVideos: { id: string; poster: string; src?: string; igLink?: string }[] = [
  { id: 'reel1', poster: '/images/reel1.jpg', src: '/images/reel1.mp4', igLink: 'https://www.instagram.com/reel/DTvGw6JguAb/?=MXVka3c2c2phZG82cw==' },
  { id: 'reel2', poster: '/images/reel2.jpg', src: '/images/reel2.mp4', igLink: 'https://www.instagram.com/reel/DMhu4lot6ZR/?igsh=b3dpeDBnMmx1OHR0' },
  { id: 'reel3', poster: '/images/reel3.jpg', src: '/images/reel3.mp4', igLink: 'https://www.instagram.com/reel/DTiWXcJgo7a/?igsh=MXhzcWQ5MDhsNmF6cQ==' },
  { id: 'reel4', poster: '/images/reel4.jpg', src: '/images/reel4.mp4', igLink: 'https://www.instagram.com/reel/DL77PjstKI8/?igsh=MXQzc2N3ZW1pOWRm' },
  { id: 'reel5', poster: '/images/reel5.jpg', igLink: 'https://www.instagram.com/reel/DR9jtSogntv/?igsh=dXhreXRyM3B4cjFm' },
  { id: 'reel6', poster: '/images/reel6.jpg', igLink: 'https://www.instagram.com/reel/DLmMzLPtL0C/?igsh=MXhvcnhvM2RsN2VkOQ==' },
];

function ReelCard({ poster, src, igLink, idx }: { poster: string; src?: string; igLink?: string; idx: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (igLink) {
    return (
      <a
        href={igLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 w-[110px] sm:w-[140px] md:w-[170px] lg:w-[200px] snap-start group cursor-pointer"
      >
        <div className="relative aspect-[9/16] bg-[#e8e2da] overflow-hidden rounded-sm">
          <img src={poster} alt={`reel${idx + 1}`} className="w-full h-full object-cover relative z-10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <ImgPlaceholder label={`reel${idx + 1}`} />
          <div className="absolute inset-0 z-20 flex items-end justify-center pb-4 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/60 transition-all">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
              </svg>
              <span className="text-[9px] tracking-[0.15em] uppercase text-white/80 font-light">Ver reel</span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className="flex-shrink-0 w-[110px] sm:w-[140px] md:w-[170px] lg:w-[200px] snap-start group cursor-pointer"
      onClick={toggle}
    >
      <div className="relative aspect-[9/16] bg-[#e8e2da] overflow-hidden rounded-sm">
        <video
          ref={videoRef}
          poster={poster}
          playsInline
          loop
          preload="none"
          className="w-full h-full object-cover relative z-10"
        >
          {src && <source src={src} type="video/mp4" />}
        </video>
        <ImgPlaceholder label={`reel${idx + 1}`} />
        <div className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0 hover:opacity-100' : 'opacity-100'} bg-black/10`}>
          <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-[#3d3530] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d={playing ? "M6 4h4v16H6zm8 0h4v16h-4z" : "M8 5v14l11-7z"} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AntesDespuesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const sectionRef = useReveal();

  const scrollToIdx = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' });
      setCurrent(idx);
    }
  };

  return (
    <section id="resultados" className="bg-[#F5F4F1] py-10 lg:py-16" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7 lg:mb-10 reveal">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#8B7355] mb-4 font-medium">Resultados</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-4 font-light tracking-wide">Antes / Después</h2>
          <p className="text-[#8B7355] text-base md:text-lg font-light">Desliza para ver las transformaciones en video</p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 lg:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 lg:justify-center"
            onScroll={(e) => {
              const el = e.currentTarget;
              const idx = Math.round(el.scrollLeft / (el.scrollWidth / adVideos.length));
              setCurrent(Math.min(idx, adVideos.length - 1));
            }}
          >
            {adVideos.map((v, i) => (
              <ReelCard key={v.id} poster={v.poster} src={v.src} igLink={v.igLink} idx={i} />
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => scrollToIdx(Math.max(0, current - 1))}
            aria-label="Reel anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-12 h-12 bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors rounded-full hidden md:flex"
          >
            <svg className="w-5 h-5 text-[#3d3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollToIdx(Math.min(adVideos.length - 1, current + 1))}
            aria-label="Siguiente reel"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-12 h-12 bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors rounded-full hidden md:flex"
          >
            <svg className="w-5 h-5 text-[#3d3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2.5 mt-8">
          {adVideos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIdx(i)}
              aria-label={`Ver reel ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-[#B8A99A] w-7' : 'bg-[#d4cfc9]'}`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/keratin_madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[14px] tracking-[0.2em] uppercase text-[#B8A99A] border-b border-[#B8A99A] pb-2 hover:text-[#3d3530] hover:border-[#3d3530] transition-colors font-light"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
            </svg>
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

const resenasGoogle = [
  { nombre: 'Laura Castillo', estrellas: 5, meta: '8 reseñas · 3 fotos', texto: 'Me ha fascinado como me han dejado mi cabello, tan sedoso y brillante. Alexa me ha tratado de lo mejor y me ha enseñado tantas cosas que no sabía sobre la salud de mi cuero cabelludo, me han cuidado y restaurado desde el interior, me ha quedado lleno de vida. Además el lugar es precioso, la decoración es hermosa, la atención son muy amables, volveré encantada!', fecha: 'Hace 5 meses' },
  { nombre: 'Monica Aranguez', estrellas: 5, meta: '5 reseñas', texto: 'Llevo con ellas desde hace bastantes meses y el cambio de mi pelo ha sido espectacular. Nunca he tenido así el pelo, tan hidratado y no se me parte! Te recomiendan cada vez que voy, que es lo ideal para ti. Las mejores sin duda ❤️', fecha: 'Hace 3 meses' },
  { nombre: 'Tatiana Rogr', estrellas: 5, meta: '2 reseñas', texto: 'Un lugar perfecto, es la segunda vez que voy porque me encanta el resultado y me encanta la profesionalidad con lo que hace todo, en todo momento sabe que necesita mi pelo y me va súper bien, acabado de primera, no solo el alisado, también la hidratación profunda y la limpieza, estoy encantada.', fecha: 'Hace 2 meses' },
  { nombre: 'Sara García', estrellas: 5, meta: '7 reseñas', texto: 'Los descubrí por Instagram en julio y estoy encantada con como está mejorando mi pelo. Me he hecho dos veces la keratina y una reconstrucción capilar. La atención al detalle, como te cuidan mientras estás con ellas y luego el seguimiento que te hacen es impecable.', fecha: 'Hace 2 meses' },
  { nombre: 'Silvia Fernandez', estrellas: 5, meta: '7 reseñas', texto: 'El trato es súper profesional, proporcionándote opciones para cuidar tu cabello. Si buscáis mejorar la salud de vuestro cabello a través de cualquier tratamiento aquí proporcionado, este es el sitio.', fecha: 'Hace 5 meses' },
  { nombre: 'Maria A. P.', estrellas: 5, meta: 'Local Guide · 60 reseñas · 12 fotos', texto: 'Llevaba mucho tiempo viendo su contenido, hasta que al fin me decidí, primero que todo el trato es fenomenal, te explican detalladamente lo que hacen, y te dan tips para cuidar en casa, hoy inicié la recuperación de mi cabello y de verdad estoy feliz con el primer resultado, así que volveré próximamente.', fecha: 'Hace 2 años' },
];

export function ReviewsSection() {
  const [feedbackType, setFeedbackType] = useState<'opinion' | 'sugerencia' | 'pregunta'>('opinion');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const sectionRef = useReveal();
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);

  useEffect(() => {
    if (reviewPaused) return;
    const timer = setInterval(() => {
      setReviewIdx(prev => (prev + 1) % resenasGoogle.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviewPaused]);

  const handleFeedback = async () => {
    if (!feedbackText.trim() || !feedbackName.trim()) return;
    setFeedbackLoading(true);
    try {
      await createReviewAPI({ nombre: feedbackName.trim(), texto: `[${feedbackType}] ${feedbackText}`, estrellas: 5, telefono: feedbackPhone.trim() || undefined });
      setFeedbackSent(true);
    } catch {
      // silent
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <section id="opiniones" className="bg-[#EEECEA] py-10 lg:py-16" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7 lg:mb-10 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-7 h-7 text-[#FBBC05]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[13px] tracking-[0.3em] uppercase text-[#8B7355] font-medium">Reseñas de Google</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-4 font-light tracking-wide">
            Lo que dicen nuestras clientas
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(n => <span key={n} className="text-[#FBBC05] text-lg">★</span>)}
            </div>
            <span className="text-[#3d3530] text-base font-medium">4.9</span>
            <span className="text-[#8B7355] text-sm font-light">· Google Reviews</span>
          </div>
          <div className="mt-4">
            <a
              href="https://share.google/kKBylpHY11LVhjLeS"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] tracking-[0.15em] uppercase text-[#B8A99A] border-b border-[#B8A99A] pb-0.5 hover:text-[#3d3530] hover:border-[#3d3530] transition-colors font-light"
            >
              Ver todas las reseñas en Google →
            </a>
          </div>
        </div>

        {/* ── Reviews Carousel ── */}
        <div
          className="relative mb-4"
          onMouseEnter={() => setReviewPaused(true)}
          onMouseLeave={() => setReviewPaused(false)}
        >
          <button
            onClick={() => setReviewIdx(prev => (prev - 1 + resenasGoogle.length) % resenasGoogle.length)}
            aria-label="Reseña anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-[#e8e2da] shadow-sm flex items-center justify-center text-2xl leading-none text-[#3d3530] hover:border-[#B8A99A] hover:text-[#B8A99A] transition-all font-light"
          >‹</button>

          <div className="overflow-hidden px-11">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${reviewIdx * 100}%)` }}
            >
              {resenasGoogle.map((r, i) => (
                <div key={i} className="w-full flex-shrink-0 flex flex-col">
                  <div className="bg-white border border-[#ede8e2] p-6 sm:p-8 mx-auto max-w-2xl w-full flex flex-col h-full">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(r.estrellas)].map((_, j) => (
                        <span key={j} className="text-[#FBBC05] text-base">★</span>
                      ))}
                    </div>
                    <p className="text-[#4a403b] text-sm sm:text-base leading-relaxed flex-1 mb-5">{r.texto}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#f0ebe4]">
                      <div className="w-9 h-9 rounded-full bg-[#B8A99A] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {r.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-[#3d3530] font-medium leading-tight">{r.nombre}</p>
                        <p className="text-xs text-[#a09890] mt-0.5">{r.fecha}</p>
                      </div>
                      <div className="ml-auto flex-shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setReviewIdx(prev => (prev + 1) % resenasGoogle.length)}
            aria-label="Siguiente reseña"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-[#e8e2da] shadow-sm flex items-center justify-center text-2xl leading-none text-[#3d3530] hover:border-[#B8A99A] hover:text-[#B8A99A] transition-all font-light"
          >›</button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {resenasGoogle.map((_, i) => (
            <button
              key={i}
              onClick={() => setReviewIdx(i)}
              aria-label={`Reseña ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === reviewIdx ? 'bg-[#B8A99A] w-6 h-2' : 'bg-[#d4cfc9] w-2 h-2'}`}
            />
          ))}
        </div>

        {/* Anonymous Feedback Block */}
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-5">
            <p className="font-serif text-2xl md:text-3xl text-[#3d3530] mb-2 font-light">¿Alguna pregunta o sugerencia?</p>
            <p className="text-sm text-[#8B7355]">Escríbenos, respondemos en menos de 24h</p>
          </div>

          {feedbackSent ? (
            <div className="text-center py-12 bg-white border border-[#f0ebe4] rounded-sm">
              <p className="text-[#8B7355] font-serif text-3xl mb-3 font-light">¡Gracias por tu opinión!</p>
              <p className="text-lg text-[#a09890] font-light">Tu feedback nos ayuda a mejorar.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#f0ebe4] p-5 rounded-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                {(['opinion', 'sugerencia', 'pregunta'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFeedbackType(type)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] tracking-[0.15em] uppercase transition-all rounded-sm font-light ${
                      feedbackType === type
                        ? 'bg-[#B8A99A] text-white'
                        : 'border border-[#e8e2da] text-[#8B7355] hover:border-[#B8A99A]'
                    }`}
                  >
                    {type === 'opinion' ? 'Opinión' : type === 'sugerencia' ? 'Sugerencia' : 'Pregunta'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Tu nombre *"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  className="w-full border border-[#e8e2da] px-3 py-2 text-sm focus:outline-none focus:border-[#B8A99A] rounded-sm"
                />
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={feedbackPhone}
                  onChange={(e) => setFeedbackPhone(e.target.value)}
                  className="w-full border border-[#e8e2da] px-3 py-2 text-sm focus:outline-none focus:border-[#B8A99A] rounded-sm"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Escribe aquí tu opinión..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full border border-[#e8e2da] px-3 py-2 text-sm focus:outline-none focus:border-[#B8A99A] resize-none mb-2 rounded-sm"
              />

              <button
                onClick={handleFeedback}
                disabled={feedbackLoading || !feedbackText.trim() || !feedbackName.trim()}
                className="w-full py-2.5 bg-[#3d3530] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#2d2520] disabled:opacity-40 font-light transition-colors rounded-sm"
              >
                {feedbackLoading ? 'Enviando...' : 'Enviar feedback'}
              </button>
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

const productCatalog = [
  {
    type: 'Champú',
    variants: [
      { line: 'Color', img: '/images/champu1.jpg', desc: 'Protege el color y aporta brillo. Sin sulfatos.', price: '22€' },
      { line: 'Volume', img: '/images/champu2.jpg', desc: 'Volumen natural sin apelmazar. Limpieza suave.', price: '22€' },
      { line: 'Detox', img: '/images/champu3.jpg', desc: 'Purificante para cuero cabelludo graso o sensible.', price: '20€' },
      { line: 'Hydration', img: '/images/champu4.jpg', desc: 'Hidratación profunda para cabello seco y dañado.', price: '24€' },
    ],
  },
  {
    type: 'Acondicionador',
    variants: [
      { line: 'Color', img: '/images/cond1.jpg', desc: 'Sella cutícula y fija el color. Brillo duradero.', price: '24€' },
      { line: 'Volume', img: '/images/cond2.jpg', desc: 'Ligereza y cuerpo. No apelmaza las fibras.', price: '24€' },
      { line: 'Detox', img: '/images/cond3.jpg', desc: 'Ligero y equilibrante. No obstruye poros.', price: '22€' },
      { line: 'Hydration', img: '/images/cond4.jpg', desc: 'Nutrición intensa sin peso. Cabello suave y flexible.', price: '26€' },
    ],
  },
  {
    type: 'Mascarilla',
    variants: [
      { line: 'Color', img: '/images/mask1.jpg', desc: 'Fija pigmentos y aporta brillo. Uso 1-2×/semana.', price: '28€' },
      { line: 'Volume', img: '/images/mask2.jpg', desc: 'Volumen y fuerza sin apelmazar las raíces.', price: '28€' },
      { line: 'Detox', img: '/images/mask3.jpg', desc: 'Arcilla purificante para cuero cabelludo.', price: '26€' },
      { line: 'Hydration', img: '/images/mask4.jpg', desc: 'Hidratación profunda. 20 min de tratamiento.', price: '30€' },
    ],
  },
  {
    type: 'Protector Spray',
    variants: [
      { line: 'Universal', img: '/images/thermo.jpg', desc: 'Protección térmica hasta 230°C. Sella y protege.', price: '18€' },
    ],
  },
];

const careTips = [
  'Champú adaptado según necesidad',
  'Mascarilla 1–2×/sem (20–30 min)',
  'Acondicionador en días sin mascarilla',
  'Termoprotector antes de secar',
  'Secador en aire tibio o frío',
  'Cepillo con púas suaves',
  'No dormir con pelo mojado',
  'Evitar agua muy caliente',
];

const CART_PENDING_KEY = 'homecare_cart_pending';

export function HomecareSection() {
  const sectionRef = useReveal();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [selectedLines, setSelectedLines] = useState<Record<string, number>>({
    'Champú': 0,
    'Acondicionador': 0,
    'Mascarilla': 0,
    'Protector Spray': 0,
  });
  const [activeLine, setActiveLine] = useState('Color');
  const handleLineFilter = (line: string, idx: number) => {
    setActiveLine(line);
    setSelectedLines({ 'Champú': idx, 'Acondicionador': idx, 'Mascarilla': idx, 'Protector Spray': 0 });
  };
  const lineFilterClasses: Record<string, string> = {
    'Color': 'bg-[#C4939B] text-white',
    'Volume': 'bg-[#9E93B8] text-white',
    'Detox': 'bg-[#7FAF96] text-white',
    'Hydration': 'bg-[#C99A72] text-white',
  };

  // ── Cart state ──
  type CartItem = { label: string; line: string; price: string };
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [cartForm, setCartForm] = useState({ nombre: '', telefono: '', notas: '' });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSent, setCartSent] = useState(false);

  // After login: restore cart saved before redirect, then auto-open cart panel
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(CART_PENDING_KEY);
      if (stored) {
        try {
          const saved = JSON.parse(stored) as CartItem[];
          if (saved.length > 0) { setCart(saved); setShowCart(true); }
        } catch { /* ignore malformed data */ }
        localStorage.removeItem(CART_PENDING_KEY);
      }
    }
  }, [user]);

  // Pre-fill nombre from logged-in user whenever user state changes
  useEffect(() => {
    if (user) setCartForm(f => ({ ...f, nombre: f.nombre || user.name || '' }));
  }, [user]);

  const addToCart = (label: string, line: string, price: string) => {
    setCart(prev => {
      const count = prev.filter(i => i.label === label && i.line === line).length;
      if (count >= 3) return prev;
      return [...prev, { label, line, price }];
    });
  };

  const removeFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCartSubmit = async () => {
    if (!cartForm.nombre.trim() || !cartForm.telefono.trim() || cart.length === 0) return;
    setCartLoading(true);
    try {
      const detalle = cart.map(i => `${i.label} (${i.line}) — ${i.price}`).join(', ');
      await createPublicReservationAPI({
        type: 'producto',
        nombre: cartForm.nombre.trim(),
        telefono: cartForm.telefono.trim(),
        detalle,
        notas: cartForm.notas.trim(),
      });
      setCartSent(true);
    } catch {
      // silent
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <section id="homecare" className="bg-[#F5F4F1] py-10 lg:py-16" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12 reveal">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#8B7355] mb-4 font-medium">Homecare</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#3d3530] mb-5 font-light tracking-wide">Cuidado en casa</h2>
          <p className="text-[#8B7355] text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            El tratamiento en salón es solo la mitad. Tu rutina en casa marca la diferencia.
          </p>
        </div>

        {/* ── Care Tips ── */}
        <div className="reveal mb-10 lg:mb-14">
          <div className="bg-[#ECEAE7] px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
            {/* Header */}
            <div className="flex items-baseline gap-6 mb-3">
              <h3 className="font-serif text-base lg:text-lg text-[#3d3530] font-light tracking-wide shrink-0">Nota de la especialista</h3>
              <div className="hidden md:block flex-1 h-px bg-[#c4b8ab]" />
            </div>
            {/* Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16">
              {careTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-[#d4cdc6]">
                  <span className="text-[13px] text-[#B8A99A] font-light pt-0.5 w-6 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-[#3b332e] leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Kit Personalizado ── */}
        <div className="reveal mb-10 lg:mb-16" id="productos">
          <div className="bg-white border-2 border-[#B8A99A]/40 overflow-hidden">
            <div className="flex flex-col md:flex-row">

              {/* Left: Image */}
              <div className="w-full md:w-[40%] lg:w-[44%] flex-shrink-0 relative bg-[#EDE8E2]" style={{ minHeight: '180px' }}>
                <img
                  src="/images/kit.jpg"
                  alt="Kit personalizado"
                  className="absolute inset-0 w-full h-full object-contain z-[1]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <ImgPlaceholder label="kit.jpg" />
              </div>

              {/* Right: Content */}
              <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between gap-4">

                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8A99A] mb-2 font-light">Kit Personalizado · Línea Limba</p>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#3d3530] mb-3 font-light">Kit de cuidado en casa</h3>
                  <p className="text-sm text-[#7a6f68] leading-relaxed max-w-md">
                    Cuatro productos elegidos por la especialista tras un diagnóstico real con tricóscopio.
                    Sin adivinanzas, sin productos genéricos.
                  </p>
                </div>

                {/* Includes */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                  {['Champú', 'Acondicionador', 'Mascarilla', 'Protector Térmico'].map(item => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0"></div>
                      <span className="text-[13px] text-[#4a403b]">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Promo */}
                <div className="border-l-2 border-[#B8A99A] pl-4 pr-3 py-1 flex items-center justify-between gap-4 bg-[#FAF8F5]">
                  <div>
                    <p className="text-[11px] tracking-[0.25em] uppercase text-[#B8A99A] mb-1 font-medium">Promo web exclusiva</p>
                    <p className="text-sm text-[#3d3530] font-light leading-snug">Diagnóstico con tricóscopio incluido al reservar</p>
                  </div>
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#8B7355] border border-[#B8A99A]/70 px-3 py-1.5 font-medium flex-shrink-0">Gratis</span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center gap-4 pt-3 border-t border-[#f0ebe4]">
                  <p className="font-serif text-3xl text-[#3d3530] font-light">90€</p>
                  {cart.some(c => c.label === 'Kit completo' && c.line === 'Personalizado') ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { const idx = [...cart].reverse().findIndex(c => c.label === 'Kit completo' && c.line === 'Personalizado'); removeFromCart(cart.length - 1 - idx); }}
                        className="w-9 h-9 flex items-center justify-center border border-[#B8A99A] text-[#B8A99A] hover:bg-[#B8A99A] hover:text-white transition-colors"
                        title="Quitar uno"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="text-sm text-[#3d3530] font-medium w-5 text-center">
                        {cart.filter(c => c.label === 'Kit completo' && c.line === 'Personalizado').length}
                      </span>
                      <button
                        onClick={() => addToCart('Kit completo', 'Personalizado', '90€')}
                        disabled={cart.filter(c => c.label === 'Kit completo' && c.line === 'Personalizado').length >= 3}
                        className="w-9 h-9 flex items-center justify-center bg-[#B8A99A] text-white hover:bg-[#9A8B7A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Añadir otro"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart('Kit completo', 'Personalizado', '90€')}
                      className="px-6 py-3 bg-[#B8A99A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors cursor-pointer font-light flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                      Añadir kit
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Product Cards Grid ── */}
        <div className="mb-14 lg:mb-20">
          <p className="text-[13px] tracking-[0.25em] uppercase text-[#8B7355] mb-4 font-medium text-center">Productos individuales · Línea Limba</p>

          {/* Global line filter */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {(['Color', 'Volume', 'Detox', 'Hydration'] as const).map((line, idx) => (
              <button
                key={line}
                onClick={() => handleLineFilter(line, idx)}
                className={`text-[10px] tracking-[0.15em] uppercase px-3.5 sm:px-5 py-2 font-light transition-all ${
                  activeLine === line
                    ? lineFilterClasses[line]
                    : 'bg-[#EDE7DF] text-[#8B7355] hover:bg-[#ddd6cd]'
                }`}
              >
                {line}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {productCatalog.map((product) => {
              const lineIdx = selectedLines[product.type] || 0;
              const variant = product.variants[lineIdx];
              return (
                <div key={product.type} className="bg-white border border-[#C0B5AC] shadow-sm hover:shadow-md transition-all flex flex-col">
                  {/* Product image */}
                  <div className="relative aspect-square bg-[#EDE8E2] overflow-hidden">
                    <img
                      src={variant.img}
                      alt={`${product.type} ${variant.line}`}
                      className="w-full h-full object-contain relative z-10"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <ImgPlaceholder label={product.type.toLowerCase()} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-2.5 sm:p-3.5">
                    {/* Line badge */}
                    {variant.line !== 'Universal' && (
                      <span className={`self-start text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 mb-2 font-light ${
                        lineFilterClasses[variant.line] || 'bg-[#3d3530] text-white'
                      }`}>{variant.line}</span>
                    )}

                    {/* Type */}
                    <p className="text-[13px] tracking-[0.12em] uppercase text-[#3d3530] mb-1 font-medium">{product.type}</p>

                  {/* Variant info */}
                  <p className="text-xs text-[#7a6f68] leading-relaxed mb-3 flex-1">{variant.desc}</p>

                  {/* Price + cart button */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#f0ebe4]">
                    <p className="font-serif text-xl text-[#3d3530] font-light">{variant.price}</p>
                    {cart.some(c => c.label === product.type && c.line === variant.line) ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { const idx = [...cart].reverse().findIndex(c => c.label === product.type && c.line === variant.line); removeFromCart(cart.length - 1 - idx); }}
                          className="w-8 h-8 flex items-center justify-center border border-[#B8A99A] text-[#B8A99A] hover:bg-[#B8A99A] hover:text-white transition-colors"
                          title="Quitar uno"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="text-xs text-[#3d3530] font-light w-4 text-center">
                          {cart.filter(c => c.label === product.type && c.line === variant.line).length}
                        </span>
                        <button
                          onClick={() => addToCart(product.type, variant.line, variant.price)}
                          disabled={cart.filter(c => c.label === product.type && c.line === variant.line).length >= 3}
                          className="w-8 h-8 flex items-center justify-center bg-[#B8A99A] text-white hover:bg-[#9A8B7A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Añadir otro"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product.type, variant.line, variant.price)}
                        className="w-8 h-8 flex items-center justify-center bg-[#B8A99A] text-white hover:bg-[#9A8B7A] transition-colors"
                        title="Añadir al carrito"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    )}
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Floating cart button ── */}
      {cart.length > 0 && !showCart && (
        <button
          onClick={() => {
            if (!user) {
              localStorage.setItem(CART_PENDING_KEY, JSON.stringify(cart));
              navigate('/login');
            } else {
              setShowCart(true);
            }
          }}
          aria-label={`Ver carrito (${cart.length} productos)`}
          className="fixed bottom-7 left-7 z-50 bg-[#3d3530] text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:bg-[#2d2520] transition-all duration-300 hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-[#B8A99A] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {cart.length}
          </span>
        </button>
      )}

      {/* ── Cart panel ── */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="relative bg-white max-w-md w-full p-8 shadow-xl z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowCart(false)} className="absolute top-5 right-5 text-[#a09890] hover:text-[#3d3530] text-2xl font-light">✕</button>

            <h3 className="font-serif text-2xl text-[#3d3530] mb-2 font-light">Tu selección</h3>

            {/* Info banner */}
            <div className="bg-[#FAF8F5] border border-[#f0ebe4] px-4 py-3 mb-6 text-[12px] text-[#7a6f68] font-light leading-relaxed">
              <span className="text-[#8B7355] font-medium">Nota:</span> Puedes hacer tu reserva aquí y te confirmaremos la disponibilidad. La recogida es directamente en el salón.
            </div>

            {cartSent ? (
              <div className="text-center py-8">
                <p className="text-[#8B7355] mb-3 font-light text-lg">✅ ¡Reserva enviada!</p>
                <p className="text-base text-[#a09890] font-light mb-6">Te contactaremos para confirmar disponibilidad.</p>
                <button onClick={() => { setShowCart(false); setCart([]); setCartSent(false); setCartForm({ nombre: '', telefono: '', notas: '' }); }}
                  className="px-8 py-3 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase font-light hover:bg-[#9A8B7A]">
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                {/* Cart items */}
                {cart.length === 0 ? (
                  <p className="text-[#a09890] text-sm font-light mb-6">Tu carrito está vacío.</p>
                ) : (
                  <div className="mb-6">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-3 border-b border-[#f0ebe4]">
                        <div>
                          <p className="text-sm text-[#3d3530] font-light">{item.label}</p>
                          <p className="text-[11px] text-[#a09890] font-light">{item.line}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-[#3d3530] font-medium">{item.price}</span>
                          <button onClick={() => removeFromCart(idx)} title="Eliminar" className="w-7 h-7 flex items-center justify-center border border-[#f0ebe4] text-[#b5a9a2] hover:border-[#e05050] hover:text-[#e05050] hover:bg-red-50 transition-all rounded-sm">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form */}
                {cart.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {user && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#F3EFE9] border-l-2 border-[#B8A99A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B8A99A] flex-shrink-0" />
                        <span className="text-[11px] tracking-[0.12em] uppercase text-[#8B7355] font-light">
                          Reservando como <span className="text-[#3d3530]">{user.name}</span>
                        </span>
                      </div>
                    )}
                    <div>
                      <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-2 font-medium">Nombre *</label>
                      <input type="text" value={cartForm.nombre} onChange={e => setCartForm(f => ({ ...f, nombre: e.target.value }))}
                        className="w-full border border-[#e8e2da] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#B8A99A]" />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-2 font-medium">Teléfono *</label>
                      <input type="tel" placeholder="+34 6XX XXX XXX" value={cartForm.telefono} onChange={e => setCartForm(f => ({ ...f, telefono: e.target.value }))}
                        className="w-full border border-[#e8e2da] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#B8A99A]" />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-2 font-medium">Notas (opcional)</label>
                      <textarea rows={2} value={cartForm.notas} onChange={e => setCartForm(f => ({ ...f, notas: e.target.value }))}
                        placeholder="Tipo de cabello, preferencias..."
                        className="w-full border border-[#e8e2da] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#B8A99A] resize-none" />
                    </div>
                    <button
                      onClick={handleCartSubmit}
                      disabled={cartLoading || !cartForm.nombre.trim() || !cartForm.telefono.trim()}
                      className="w-full py-3.5 bg-[#3d3530] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#2d2520] disabled:opacity-40 font-medium transition-colors"
                    >
                      {cartLoading ? 'Enviando...' : 'Confirmar reserva'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
  const sectionRef = useReveal();

  const handleReservar = (f: string) => {
    requireAuth(() => {
      setSelectedFormacion(f);
      setShowModal(true);
    });
  };

  return (
    <section id="formaciones" className="bg-[#F3F2EE] py-10 lg:py-16" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 lg:mb-6 reveal">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#8B7355] mb-4 font-medium">Para Profesionales</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-4 font-light tracking-wide">Formaciones</h2>
        </div>

        {/* ── foto strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-5 lg:mb-8 reveal">
          {['/images/ker.jpg', '/images/kera.jpg', '/images/rec.jpg', '/images/reca.jpg'].map((src, i) => (
            <div key={i} className="relative aspect-[3/4] sm:aspect-[2/3] bg-[#f5f2ee] overflow-hidden">
              <img src={src} alt={`Formacion ${i + 1}`} className="absolute inset-0 w-full h-full object-cover object-center z-[1]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <ImgPlaceholder label={src.split('/').pop() || ''} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-7 max-w-[1400px] mx-auto">
          <div className="border border-[#e8e2da] p-4 md:p-6 flex flex-col gap-3 hover:border-[#B8A99A] transition-all">
            <span className="self-start text-[11px] tracking-[0.2em] uppercase text-white bg-[#B8A99A] px-4 py-1.5 font-medium">
              Curso destacado
            </span>
            <h3 className="font-serif text-lg md:text-2xl text-[#3d3530] font-light">Curso intensivo de keratina</h3>
            <p className="text-sm text-[#8B7355] font-light">2 días · Práctica con modelos</p>

            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-2 font-light">Programa</p>
              <ul className="space-y-1.5">
                {['Diagnóstico con tricóscopio', 'Protocolos de keratina y botox', 'Selección de producto según tipo de pelo', 'Técnica de aplicación paso a paso', 'Práctica con modelos reales'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3d3530] font-light">
                    <svg className="w-3.5 h-3.5 text-[#B8A99A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-3 font-light">Incluye</p>
              <p className="text-sm text-[#7a6f68] font-light leading-relaxed">
                Materiales · Manual profesional · Fotos · Certificado
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-3 border border-[#f0ebe4]">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 text-[#8B7355]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#8B7355] font-light">Bonus</p>
              </div>
              <p className="text-sm text-[#3d3530] font-light">Acceso a grupo privado de soporte post-formación</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-[#f0ebe4] gap-4">
              <span className="font-serif text-2xl md:text-3xl text-[#3d3530] font-light">1.400€</span>
              <button
                onClick={() => handleReservar('Curso intensivo de keratina')}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] cursor-pointer font-light"
              >
                Reservar plaza
              </button>
            </div>
          </div>

          <div className="border border-[#e8e2da] p-4 md:p-6 flex flex-col gap-3 hover:border-[#B8A99A] transition-all">
            <span className="self-start text-[11px] tracking-[0.2em] uppercase text-white bg-[#8B7355] px-4 py-1.5 font-light">
              Masterclass
            </span>
            <h3 className="font-serif text-lg md:text-2xl text-[#3d3530] font-light">Reconstrucción en Frío</h3>
            <p className="text-sm text-[#8B7355] font-light">Intensivo · Máx. 6 personas</p>

            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-2 font-light">Programa</p>
              <ul className="space-y-1.5">
                {['Teoría de reconstrucción capilar', 'Diagnóstico y selección de producto', 'Técnica de aplicación en frío', 'Casos reales y resolución de dudas'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3d3530] font-light">
                    <svg className="w-3.5 h-3.5 text-[#B8A99A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-3 font-light">Incluye</p>
              <p className="text-sm text-[#7a6f68] font-light leading-relaxed">
                Materiales · Guía profesional · Certificado
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-3 border border-[#f0ebe4]">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 text-[#8B7355]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#8B7355] font-light">Bonus</p>
              </div>
              <p className="text-sm text-[#3d3530] font-light">Descuento especial en productos profesionales Limba</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-[#f0ebe4] gap-4">
              <div>
                <span className="font-serif text-2xl md:text-3xl text-[#3d3530] font-light">350€</span>
                <span className="text-sm text-[#8B7355] block font-light">por persona · mín. 3</span>
              </div>
              <button
                onClick={() => handleReservar('Masterclass Reconstrucción')}
                className="w-full sm:w-auto px-6 py-2.5 border border-[#B8A99A] text-[#B8A99A] text-[12px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white cursor-pointer font-light"
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

const STRIPE_SCRIPTS_URL = 'https://buy.stripe.com/5kQdRb8cbglMf7E7dSdQQ00';
const HAS_STRIPE_KEY = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export function BeautyScriptsSection() {
  const sectionRef = useReveal();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <section id="scripts" className="bg-[#3F3028] py-10 lg:py-14" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 lg:mb-6 lg:text-left reveal">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#B8A99A] mb-3 font-light">Scripts</p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#F0EAE0] mb-3 font-light tracking-wide">Beauty Scripts</h2>
          <p className="text-sm md:text-base text-[#9A8B82] max-w-2xl lg:mx-0 mx-auto font-light leading-relaxed">
            Scripts listos para usar que aumentan tus ventas. Diálogos profesionales para especialistas de beauty.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-7 lg:gap-10 items-start">
          <div className="w-full sm:w-[220px] lg:w-[260px] xl:w-[300px] flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative aspect-[4/5] bg-[#1a1714] overflow-hidden shadow-sm">
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

          <div className="flex-1 flex flex-col gap-3 sm:gap-5">
            <div className="flex flex-col gap-2 sm:gap-4">
              {[
                ['Ahorra tiempo', 'Scripts probados y listos para usar.'],
                ['Reduce estrés', 'Responde con confianza a cualquier pregunta.'],
                ['Más conversiones', 'Optimizados para cerrar más ventas.'],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-3">
                  <span className="w-5 h-5 border border-[#B8A99A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-[#B8A99A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm sm:text-base md:text-lg font-light text-[#EDE7DC]">{t}</p>
                    <p className="hidden sm:block text-sm text-[#9A8B82] font-light">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            {HAS_STRIPE_KEY ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full sm:w-auto self-start px-8 py-3 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors font-light cursor-pointer"
              >
                Quiero los Scripts
              </button>
            ) : (
              <a
                href={STRIPE_SCRIPTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto self-start px-8 py-3 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors font-light text-center"
              >
                Quiero los Scripts
              </a>
            )}
          </div>
        </div>
      </div>

      {showCheckout && (
        <Suspense fallback={null}>
          <StripeCheckoutModal onClose={() => setShowCheckout(false)} />
        </Suspense>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 9. GOOGLE MAP
// ═══════════════════════════════════════════════════════════════

export function GoogleMapSection() {
  return (
    <section id="ubicacion" className="bg-[#FAF8F5] border-t border-[#ede8e2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8A99A] mb-1 font-light">Ubicación</p>
            <h2 className="font-serif text-xl text-[#3d3530] font-light">Calle Altamirano, 11 — Madrid</h2>
          </div>
          <a
            href="https://maps.google.com/?q=Calle+Altamirano+11+Madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.15em] uppercase text-[#B8A99A] border-b border-[#B8A99A]/50 pb-0.5 hover:text-[#3d3530] hover:border-[#3d3530] transition-colors font-light hidden sm:block"
          >
            Abrir en Maps →
          </a>
        </div>
        <div className="aspect-[16/4] md:aspect-[16/3] w-full overflow-hidden">
          <iframe
            title="Keratin Madrid ubicación"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.4!2d-3.7144!3d40.4306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4228e23d0b0b0b%3A0x0!2sCalle+de+Altamirano%2C+Madrid!5e0!3m2!1sen!2ses!4v1700000000000"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
