// РУС: Все секции главной страницы в одном файле.
//      Каждая секция — отдельный экспортируемый компонент.
// ESP: Todas las secciones de la página principal.
//
// СЕКЦИИ:
//   1. PorQueElegirSection  — ¿Por qué elegir Keratin Madrid?
//   2. TratamientosSection  — Tratamientos (с маленькими фото mobile)
//   3. TablaDePreciosSection— Tabla de Precios (кнопка "Reservar")
//   4. AntesDespuesSection  — Antes / Después
//   5. ReviewsSection       — Opiniones (с формой → логин → API)
//   6. HomecareSection      — Homecare (компактно mobile + Kit)
//   7. FormacionesSection   — Formaciones (Reservar plaza → DB)
//   8. BeautyScriptsSection — Beauty Scripts (ссылка Stripe)
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import { createReviewAPI } from '../api/reviews.api';
import { createReservationAPI } from '../api/reservations.api';
import type { ReservationForm } from '../types';

// ── УТИЛИТЫ ──────────────────────────────────────────────────

// Плейсхолдер для изображений (показывает имя файла)
// 📁 ТОЧКА 11: Подготовка мест для картинок
function ImgPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f0ebe4]">
      <svg className="w-7 h-7 text-[#c9bfb5] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
      </svg>
      <span className="text-[10px] tracking-widest uppercase text-[#c9bfb5]">{label}</span>
    </div>
  );
}

// ── Модальная форма резервации ────────────────────────────────
// Используется в: Kit, Formaciones, Precios
// Собирает: nombre, telefono, detalle, notas

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
  isOpen, onClose, type, title,
  detalleLabel, detallePlaceholder, successMessage
}: ReservationModalProps) {
  const user = useAppSelector((s) => s.auth.user);
  const [form, setForm] = useState({ nombre: user?.name || '', telefono: '', detalle: '', notas: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Обновляем имя если user изменился
  useEffect(() => {
    if (user?.name) setForm(f => ({ ...f, nombre: user.name }));
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
        notas: form.notas
      });
      setSent(true);
    } catch {
      setError('Error al enviar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white max-w-md w-full p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-[#a09890] hover:text-[#3d3530]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h3 className="font-serif text-xl text-[#3d3530] mb-4">{title}</h3>

        {sent ? (
          <div className="text-center py-6">
            <p className="text-[#8B7355] text-base mb-2">✅ {successMessage}</p>
            <p className="text-sm text-[#a09890]">Te contactaremos pronto para confirmar.</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase">
              Cerrar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Nombre</label>
              <input type="text" value={form.nombre}
                onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <div>
              <label className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Teléfono *</label>
              <input type="tel" value={form.telefono} placeholder="+34 6XX XXX XXX"
                onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <div>
              <label className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">{detalleLabel}</label>
              <input type="text" value={form.detalle} placeholder={detallePlaceholder}
                onChange={(e) => setForm(f => ({ ...f, detalle: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <div>
              <label className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Notas (opcional)</label>
              <textarea rows={2} value={form.notas} placeholder="Comentarios adicionales..."
                onChange={(e) => setForm(f => ({ ...f, notas: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A] resize-none"/>
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors disabled:opacity-50">
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
            <p className="text-[10px] text-[#a09890] text-center">
              Nos pondremos en contacto contigo para confirmar día y hora.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Хук: проверяет логин, если нет → navigate('/login')
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
// 1. ¿POR QUÉ ELEGIR KERATIN MADRID?
// ═══════════════════════════════════════════════════════════════

const beneficios = [
  { titulo: 'Diagnóstico con tricóscopo', texto: 'Analizamos cabello y cuero cabelludo antes de elegir cualquier protocolo.' },
  { titulo: 'Protocolos exclusivos', texto: 'Tecnología premium anti-daño. Fórmulas seguras que no queman ni resecan.' },
  { titulo: 'Servicio de alto nivel', texto: 'Atención personalizada, experiencia cómoda y cuidado en cada detalle.' },
  { titulo: 'Seguimiento y cuidado', texto: 'Plan claro para prolongar resultados al máximo después del tratamiento.' },
  { titulo: 'Corrección de hábitos', texto: 'Ajustamos hábitos sencillos que marcan la diferencia día a día.' },
  { titulo: 'Resultados duraderos', texto: 'Trabajamos para meses, no para un día. Resultados acumulativos y reales.' },
];

export function PorQueElegirSection() {
  return (
    <section id="inicio" className="bg-white py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Beneficios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">
            ¿Por qué elegir Keratin Madrid?
          </h2>
          <p className="text-[#8B7355] text-base md:text-lg max-w-lg mx-auto">
            Nos diferenciamos por nuestro enfoque en la salud capilar y resultados duraderos.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {beneficios.map((b, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 md:p-6 border border-[#f0ebe4] hover:border-[#B8A99A] transition-all">
              <h3 className="font-serif text-base md:text-lg text-[#3d3530]">{b.titulo}</h3>
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
// ✅ ТОЧКА 2: Фото в mobile — маленькие (h-[160px])

const tratamientos = [
  {
    img: '/images/image1.jpg',         // 📁 → public/images/image1.jpg (Alisado de keratina)
    tag: 'Bestseller', nombre: 'Alisado de Keratina', duracion: '3–6 meses',
    desc: 'Alisado seguro, sin formol. Adaptado al diagnóstico previo de cada tipo de cabello.',
    ben: ['Reduce frizz', 'Brillo espejo duradero', 'Más disciplina', 'Ahorra tiempo al peinar'],
    indicado: 'Cabellos rizados, encrespados, rebeldes',
    efecto: 'Liso, brillante y manejable 3–6 meses.'
  },
  {
    img: '/images/image2.jpg',         // 📁 → public/images/image2.jpg (Reconstrucción)
    tag: 'Reparador', nombre: 'Reconstrucción en frío', duracion: 'Resultado acumulativo',
    desc: 'Recuperación profunda sin alisar. Restaura fuerza, densidad y elasticidad.',
    ben: ['Reposición de proteínas', 'Reduce rotura', 'Mejora brillo', 'Compatible con decoloraciones'],
    indicado: 'Cabello seco, dañado o decolorado',
    efecto: 'Más fuerte y nutrido, resultado acumulativo.'
  },
  {
    img: '/images/image3.jpg',         // 📁 → public/images/image3.jpg (Peeling)
    tag: 'Detox', nombre: 'Peeling Capilar', duracion: 'Limpieza + diagnóstico',
    desc: 'Limpieza profunda con diagnóstico mediante tricóscopo.',
    ben: ['Elimina grasa', 'Activa circulación', 'Previene caspa', 'Mejora oxigenación'],
    indicado: 'Cuero cabelludo graso, caída, pesadez',
    efecto: 'Frescor, ligereza y mayor volumen.'
  },
  {
    img: '/images/image4.jpg',         // 📁 → public/images/image4.jpg (Head Spa)
    tag: 'Relax', nombre: 'Head Spa', duracion: 'Ritual de bienestar',
    desc: 'Ritual de salud y relax con masaje y productos profesionales.',
    ben: ['Activa microcirculación', 'Nutre folículo', 'Reduce estrés', 'Favorece crecimiento'],
    indicado: 'Caída, estrés, bienestar general',
    efecto: 'Ligereza, brillo y equilibrio total.'
  },
];

export function TratamientosSection() {
  const scrollToPrecios = () => {
    document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicios" className="bg-[#FAF8F5] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Servicios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Tratamientos</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Tratamientos profesionales adaptados a tu tipo de cabello</p>
        </div>

        <div className="flex flex-col gap-10 lg:gap-14">
          {tratamientos.map((t, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-5 md:gap-10 items-center`}>
              {/* ✅ ТОЧКА 2: Фото маленькие на mobile (h-[160px]) */}
              <div className="w-full md:w-[240px] lg:w-[280px] flex-shrink-0">
                <div className="relative h-[160px] md:h-auto md:aspect-[3/4] bg-[#e8e2da] overflow-hidden">
                  <img src={t.img} alt={t.nombre}
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
                  <ImgPlaceholder label={t.img.split('/').pop() || ''}/>
                  <div className="absolute top-2 left-2 bg-[#3d3530] text-white text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 z-20">
                    {t.tag}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-1">{t.duracion}</p>
                  <h3 className="font-serif text-xl md:text-2xl text-[#3d3530] mb-1">{t.nombre}</h3>
                  <p className="text-[#7a6f68] text-sm md:text-base leading-relaxed">{t.desc}</p>
                </div>
                <ul className="grid grid-cols-2 gap-1.5">
                  {t.ben.map((b, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-xs md:text-sm text-[#7a6f68]">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0"/>
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
                <button onClick={scrollToPrecios}
                  className="self-start px-6 py-2 border border-[#B8A99A] text-[#B8A99A] text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all cursor-pointer">
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
// ✅ ТОЧКА 6: Кнопка "Reservar" вместо "Calcular mi precio" → login/booking

const precios = [
  { l: '20–30 cm', k: '180€', r: '150€' },
  { l: '30–40 cm', k: '200€', r: '165€' },
  { l: '40–50 cm', k: '220€', r: '180€' },
  { l: '50–60 cm', k: '240€', r: '200€' },
  { l: '60–70 cm', k: '260€', r: '220€' },
  { l: '70–80 cm', k: '280€', r: '240€' },
];

export function TablaDePreciosSection() {
  const [tab, setTab] = useState<'k' | 'r'>('k');
  const { user, requireAuth } = useRequireAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleReservar = () => {
    requireAuth(() => {
      // Если залогинен → показываем модал резервации или идём на /booking
      navigate('/booking');
    });
  };

  return (
    <section id="precios" className="bg-white py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Precios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Tabla de Precios</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Precios transparentes adaptados a la longitud de tu cabello</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="flex-1 w-full">
            {/* Tabs */}
            <div className="flex border-b border-[#e8e2da] mb-6">
              {[['k', 'Keratina / Botox'], ['r', 'Reconstrucción']].map(([v, label]) => (
                <button key={v} onClick={() => setTab(v as 'k' | 'r')}
                  className={`pb-3 px-4 md:px-6 text-[11px] md:text-[12px] tracking-[0.12em] uppercase transition-all ${tab === v ? 'border-b-2 border-[#B8A99A] text-[#3d3530]' : 'text-[#a09890] hover:text-[#3d3530]'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Precios */}
            <div className="flex flex-col divide-y divide-[#f0ebe4]">
              {precios.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3 md:py-4">
                  <span className="text-sm md:text-base text-[#3d3530]">{p.l}</span>
                  <span className="font-serif text-lg md:text-xl text-[#3d3530]">{tab === 'k' ? p.k : p.r}</span>
                </div>
              ))}
            </div>

            {/* Extras */}
            <div className="mt-5 bg-[#FAF8F5] px-4 py-3 text-xs md:text-sm text-[#7a6f68] space-y-1">
              <p><span className="text-[#3d3530] font-medium">Cabello abundante:</span> +20€ (7cm) · +40€ (9cm) · +60€ (10+cm)</p>
              <p><span className="text-[#3d3530] font-medium">Extras:</span> Peeling anticaspa +65€ · Nano Gold +50€ · Corte puntas +20€</p>
            </div>

            {/* ✅ ТОЧКА 6: Кнопка "Reservar" → login/register → booking */}
            <button onClick={handleReservar}
              className="mt-5 inline-block px-8 py-3 bg-[#B8A99A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors cursor-pointer">
              Reservar cita
            </button>
          </div>

          {/* Guía de longitud */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 text-center">Guía de longitud</p>
            {/* 📁 → public/images/image8.jpg (guía de longitud) */}
            <div className="relative bg-[#f0ebe4] overflow-hidden">
              <img src="/images/image8.jpg" alt="Guía de longitud" className="w-full object-contain relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
              <ImgPlaceholder label="image8.jpg"/>
            </div>
            <div className="mt-3 space-y-1 text-xs md:text-sm">
              {[['20–30 cm','Debajo de la oreja'],['30–40 cm','Hombros'],['40–50 cm','Mitad espalda'],['50–60 cm','Cintura'],['60–70 cm','Bajo cintura'],['70–80 cm','Cadera']].map(([l,d]) => (
                <div key={l} className="flex gap-2">
                  <span className="text-[#B8A99A] font-medium w-16 flex-shrink-0">{l}</span>
                  <span className="text-[#7a6f68]">{d}</span>
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
// 4. ANTES & DESPUÉS
// ═══════════════════════════════════════════════════════════════

const adFotos = [
  // 📁 → public/images/photo-output.jpeg, image7.jpg, image6.jpeg, image5.jpg
  { img: '/images/photo-output.jpeg', link: 'https://www.instagram.com/reel/DCJ-1UTNQ1_/' },
  { img: '/images/image7.jpg',        link: 'https://www.instagram.com/reel/DCDVx8RNsVt/' },
  { img: '/images/image6.jpeg',       link: 'https://www.instagram.com/reel/DCDWDpztO7N/' },
  { img: '/images/image5.jpg',        link: 'https://www.instagram.com/reel/DCDWSW4Njcx/' },
];

export function AntesDespuesSection() {
  return (
    <section id="resultados" className="bg-[#FAF8F5] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Resultados</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Antes / Después</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Resultados reales de nuestros tratamientos</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {adFotos.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
              className="relative aspect-[3/4] bg-[#e8e2da] overflow-hidden group block">
              <img src={item.img} alt={`Transformación ${i+1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
              <ImgPlaceholder label={item.img.split('/').pop() || ''}/>
            </a>
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="https://www.instagram.com/keratin_madrid" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-[#8B7355] border-b border-[#B8A99A] pb-1 hover:text-[#3d3530] transition-colors">
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
// ✅ ТОЧКА 7: Enviar reseña → требуется логин → сохранение в БД

const resenasEstaticas = [
  { nombre: 'Ana M.', estrellas: 5, texto: 'El resultado fue increíble desde la primera sesión. El cabello quedó brillante, suave y sin frizz.' },
  { nombre: 'Laura P.', estrellas: 5, texto: 'Llevo dos años yendo y cada vez mejor. La keratina dura muchísimo y el trato es excelente.' },
  { nombre: 'Sofía R.', estrellas: 5, texto: 'Tenía el pelo muy dañado por decoloraciones y después de la reconstrucción cambió completamente.' },
  { nombre: 'María G.', estrellas: 5, texto: 'El Head Spa fue una experiencia maravillosa. Me fui completamente relajada.' },
  { nombre: 'Elena T.', estrellas: 5, texto: 'Vine por recomendación y no me arrepiento. El diagnóstico con tricóscopo fue muy profesional.' },
  { nombre: 'Carmen V.', estrellas: 5, texto: 'El kit de homecare alargó el resultado del alisado mucho más de lo esperado.' },
];

export function ReviewsSection() {
  const { user, requireAuth } = useRequireAuth();
  const [form, setForm] = useState({ nombre: '', texto: '', estrellas: 5 });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // Устанавливаем имя пользователя если залогинен
  useEffect(() => {
    if (user?.name) setForm(f => ({ ...f, nombre: user.name }));
  }, [user]);

  // ✅ ТОЧКА 7: Enviar reseña → если не залогинен → login
  const handleSubmit = () => {
    requireAuth(async () => {
      if (!form.nombre.trim() || !form.texto.trim()) {
        setError('Completa tu nombre y experiencia.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        await createReviewAPI({
          nombre: form.nombre,
          texto: form.texto,
          estrellas: form.estrellas
        });
        setSent(true);
      } catch {
        setError('No se pudo enviar. Inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <section id="opiniones" className="bg-white py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Testimonios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">
            Lo que dicen nuestras clientas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-12">
          {resenasEstaticas.map((r, i) => (
            <div key={i} className="flex flex-col gap-2 p-5 bg-[#FAF8F5] border border-[#f0ebe4]">
              <div className="flex gap-0.5">
                {[...Array(r.estrellas)].map((_, j) => (
                  <span key={j} className="text-[#B8A99A] text-sm">★</span>
                ))}
              </div>
              <p className="text-[#3d3530] text-sm leading-relaxed flex-1 italic font-serif">"{r.texto}"</p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#8B7355]">{r.nombre}</p>
            </div>
          ))}
        </div>

        {/* Форма отзыва */}
        <div className="max-w-md mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#a09890] text-center mb-5">
            Comparte tu experiencia
          </p>
          {sent ? (
            <p className="text-center text-sm text-[#8B7355] py-4">¡Gracias! Tu reseña será revisada pronto.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-1 justify-center">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, estrellas: n }))}
                    className={`text-xl transition-colors ${n <= form.estrellas ? 'text-[#B8A99A]' : 'text-[#e8e2da]'}`}>★</button>
                ))}
              </div>
              <input type="text" placeholder="Tu nombre" value={form.nombre}
                onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
              <textarea rows={3} placeholder="Tu experiencia..." value={form.texto}
                onChange={(e) => setForm(f => ({ ...f, texto: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A] resize-none"/>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-2.5 bg-[#B8A99A] text-white text-[11px] tracking-[0.15em] uppercase hover:bg-[#9A8B7A] transition-colors disabled:opacity-50">
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
// 6. HOMECARE
// ═══════════════════════════════════════════════════════════════
// ✅ ТОЧКА 3: Compact on mobile
// ✅ ТОЧКА 8: Kit → Reservar → login → form → DB

// 📁 Kit images: public/images/kit1.jpg, kit2.jpg, kit3.jpg
const KIT_FOTOS = ['/images/kit1.jpg', '/images/kit2.jpg', '/images/kit3.jpg'];

function KitCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % KIT_FOTOS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[140px] mx-auto lg:max-w-full aspect-square overflow-hidden bg-[#e8e2da]">
      {KIT_FOTOS.map((src, i) => (
        <img key={src} src={src} alt={`Kit homecare ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
      ))}
      <ImgPlaceholder label={`kit${idx + 1}.jpg`}/>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {KIT_FOTOS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/50'}`}/>
        ))}
      </div>
    </div>
  );
}

// ✅ ТОЧКА 3: Pasos компактные на mobile
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
  const { user, requireAuth } = useRequireAuth();
  const [showKitModal, setShowKitModal] = useState(false);

  // ✅ ТОЧКА 8: Reservar kit → login → form
  const handleReservarKit = () => {
    requireAuth(() => setShowKitModal(true));
  };

  return (
    <section id="homecare" className="bg-[#FAF8F5] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Homecare</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Cuidado en casa</h2>
          <p className="text-[#8B7355] text-sm md:text-base max-w-lg mx-auto">
            Prolonga los resultados de tu tratamiento profesional.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          {/* ✅ ТОЧКА 3: Pasos — компактно на mobile */}
          <div className="flex-1">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 md:gap-y-3">
              {pasos.map((paso, i) => (
                <li key={i} className="flex items-start gap-2 py-1.5 md:py-2 border-b border-[#ede8e2]">
                  <span className="flex-shrink-0 w-5 h-5 border border-[#d4cfc9] flex items-center justify-center text-[9px] text-[#B8A99A] mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm md:text-base text-[#3d3530] leading-snug">{paso}</span>
                </li>
              ))}
            </ul>

            {/* Nota especialista */}
            <div className="mt-6 border-l-2 border-[#B8A99A] pl-4 py-1">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8A99A] mb-2">Nota de la especialista</p>
              <p className="font-serif text-base md:text-lg text-[#3d3530] italic mb-2">
                "El salón hace el 50% del trabajo. El otro 50% lo haces tú en casa."
              </p>
              <p className="text-xs md:text-sm text-[#8B7355] leading-relaxed">
                Los primeros tres días son los más críticos. Lo que hagas esos días determina cuánto dura el resultado.
              </p>
            </div>
          </div>

          {/* ✅ ТОЧКА 8: Kit с кнопкой "Reservar kit" */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <KitCarousel />
            <div className="bg-white p-5 border border-[#e8e2da]">
              <p className="text-[10px] tracking-widest uppercase text-[#B8A99A] mb-1">Producto destacado</p>
              <h3 className="font-serif text-lg text-[#3d3530] mb-2">Kit personalizado</h3>
              <p className="text-xs text-[#7a6f68] mb-3 leading-relaxed">
                Champú · Acondicionador · Mascarilla · Protector térmico.
              </p>
              <p className="font-serif text-xl text-[#3d3530] mb-3">90€</p>

              {/* ✅ ТОЧКА 8: Кнопка "Reservar kit y conseguir el regalo" */}
              <button onClick={handleReservarKit}
                className="block w-full text-center py-2.5 bg-[#B8A99A] text-white text-[10px] tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors cursor-pointer mb-2">
                🎁 Reservar kit
              </button>
              <p className="text-[9px] text-[#a09890] text-center leading-relaxed">
                Al reservar, recibes diagnóstico con tricóscopo + kit adaptado a tu tipo de cabello en el salón.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Kit */}
      <ReservationModal
        isOpen={showKitModal}
        onClose={() => setShowKitModal(false)}
        type="kit"
        title="Reservar Kit Personalizado"
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
// ✅ ТОЧКА 9: Reservar plaza → login → form → DB

export function FormacionesSection() {
  const { requireAuth } = useRequireAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedFormacion, setSelectedFormacion] = useState('');

  const handleReservar = (formacion: string) => {
    requireAuth(() => {
      setSelectedFormacion(formacion);
      setShowModal(true);
    });
  };

  return (
    <section id="formaciones" className="bg-white py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Para Profesionales</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Formaciones</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Aprende técnicas profesionales de tratamiento capilar</p>
        </div>

        {/* Фото формаций */}
        {/* 📁 → public/images/img-9502.jpeg, img-9505.jpeg, img-9506.jpeg */}
        <div className="grid grid-cols-3 gap-2 mb-10 max-w-3xl mx-auto">
          {['/images/img-9502.jpeg', '/images/img-9505.jpeg', '/images/img-9506.jpeg'].map((src, i) => (
            <div key={i} className="relative aspect-square bg-[#f0ebe4] overflow-hidden">
              <img src={src} alt={`Formación ${i+1}`} className="w-full h-full object-cover relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
              <ImgPlaceholder label={src.split('/').pop() || ''}/>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Curso intensivo */}
          <div className="border border-[#e8e2da] p-6 md:p-8 flex flex-col gap-4">
            <span className="self-start text-[10px] tracking-[0.2em] uppercase text-white bg-[#3d3530] px-3 py-1">Curso destacado</span>
            <div>
              <h3 className="font-serif text-xl md:text-2xl text-[#3d3530] mb-1">Curso intensivo de keratina</h3>
              <p className="text-sm text-[#8B7355]">Formación completa · 2 días · Práctica con modelos</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {['Diagnóstico tricoscópico','Técnicas de aplicación','Selección de productos','Gestión del calor','Precio y venta','Práctica con modelos'].map(t => (
                <div key={t} className="flex items-start gap-1.5 text-xs md:text-sm text-[#7a6f68]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0"/>
                  {t}
                </div>
              ))}
            </div>
            <p className="text-xs md:text-sm text-[#7a6f68]">
              <span className="text-[#3d3530]">Incluye:</span> Materiales · Manual PDF · Fotos portfolio · Certificado
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-[#f0ebe4]">
              <span className="font-serif text-2xl md:text-3xl text-[#3d3530]">1.400€</span>
              {/* ✅ ТОЧКА 9: Reservar plaza → login → form → DB */}
              <button onClick={() => handleReservar('Curso intensivo de keratina')}
                className="px-5 py-2.5 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors cursor-pointer">
                Reservar plaza
              </button>
            </div>
          </div>

          {/* Masterclass */}
          <div className="border border-[#e8e2da] p-6 md:p-8 flex flex-col gap-4">
            <span className="self-start text-[10px] tracking-[0.2em] uppercase text-white bg-[#8B7355] px-3 py-1">Masterclass</span>
            <div>
              <h3 className="font-serif text-xl md:text-2xl text-[#3d3530] mb-1">Reconstrucción en Frío</h3>
              <p className="text-sm text-[#8B7355]">Especialización · Intensivo · Máx. 6 personas</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {['Técnicas avanzadas','Métodos profesionales','Grupos reducidos','Material incluido','Guía completa','Certificado'].map(t => (
                <div key={t} className="flex items-start gap-1.5 text-xs md:text-sm text-[#7a6f68]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0"/>
                  {t}
                </div>
              ))}
            </div>
            <p className="text-xs md:text-sm text-[#7a6f68]">
              <span className="text-[#3d3530]">Para quién:</span> Profesionales con experiencia básica
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-[#f0ebe4]">
              <div>
                <span className="font-serif text-2xl md:text-3xl text-[#3d3530]">350€</span>
                <span className="text-xs text-[#8B7355] block">por persona · mín. 3</span>
              </div>
              <button onClick={() => handleReservar('Masterclass Reconstrucción en Frío')}
                className="px-5 py-2.5 border border-[#B8A99A] text-[#B8A99A] text-[11px] tracking-widest uppercase hover:bg-[#B8A99A] hover:text-white transition-all cursor-pointer">
                Reservar plaza
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Formaciones */}
      <ReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="formacion"
        title="Reservar plaza"
        detalleLabel="Formación deseada"
        detallePlaceholder={selectedFormacion}
        successMessage="¡Plaza reservada!"
      />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8. BEAUTY SCRIPTS
// ═══════════════════════════════════════════════════════════════
// ✅ ТОЧКА 10: "Quiero los Scripts" → ссылка на Stripe

// 🎨 ЗАМЕНИ ЭТУ ССЫЛКУ на реальную Stripe ссылку:
const STRIPE_SCRIPTS_URL = 'https://buy.stripe.com/TU_STRIPE_LINK_AQUI';

export function BeautyScriptsSection() {
  return (
    <section id="scripts" className="bg-[#FAF8F5] py-16 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* 📁 → public/images/img-9476.jpeg (Beauty Scripts mockup) */}
          <div className="w-full sm:w-56 lg:w-72 flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative aspect-[4/5] bg-[#f0ebe4] overflow-hidden">
              <img src="/images/img-9476.jpeg" alt="Beauty Scripts"
                className="w-full h-full object-cover relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
              <ImgPlaceholder label="img-9476.jpeg"/>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Scripts</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-4">Beauty Scripts</h2>
              <p className="text-sm md:text-base text-[#7a6f68] leading-relaxed">
                Scripts listos para usar que aumentan tus ventas. Diálogos profesionales para maestros de belleza.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                ['Ahorra tiempo', 'Usa scripts probados y listos.'],
                ['Reduce estrés', 'Responde con confianza a cualquier pregunta.'],
                ['Aumenta conversiones', 'Scripts optimizados para cerrar más ventas.'],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-3">
                  <span className="w-4 h-4 border border-[#B8A99A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-2 h-2 text-[#B8A99A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m4.5 12.75 6 6 9-13.5"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm md:text-base font-medium text-[#3d3530]">{t}</p>
                    <p className="text-xs md:text-sm text-[#8B7355]">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* ✅ ТОЧКА 10: Ссылка на Stripe */}
            <a href={STRIPE_SCRIPTS_URL} target="_blank" rel="noopener noreferrer"
              className="self-start px-8 py-3 bg-[#B8A99A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors">
              Quiero los Scripts
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
