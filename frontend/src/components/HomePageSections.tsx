// components/HomePageSections.tsx
// Все новые секции для HomePage:
// 1. HomecareSection    — premium note + kit + 4 продукта
// 2. PreciosBanner      — баннер над таблицей цен
// 3. AntesDespuesSection — галерея до/после
// 4. ReviewsSection     — аккордеон отзывов
// 5. BeautyScriptsSection — секция для профессионалов

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';

// ─────────────────────────────────────────────────────────────
// 1. HOMECARE SECTION
// ─────────────────────────────────────────────────────────────
// Props: user — если залогинен, кнопка ведёт на /booking
//        если нет — на /login
export function HomecareSection({ user }: { user: User | null }) {
  const INDIVIDUAL_PRODUCTS = [
    { name: 'Champú Keratin',      price: '18€', emoji: '🧴' },
    { name: 'Acondicionador',       price: '16€', emoji: '💧' },
    { name: 'Mascarilla Nutritiva', price: '22€', emoji: '✨' },
    { name: 'Termoprotector',       price: '20€', emoji: '🌡️' },
  ];

  return (
    <section id="homecare" className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">

        {/* Заголовок секции */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#B8A99A]/10 text-[#B8A99A] text-xs tracking-[0.3em] uppercase rounded-full mb-4">
            Homecare
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-[#3D3D3D] mb-4">
            Cuida tu keratina en casa
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#B8A99A] to-transparent mx-auto" />
        </div>

        {/* Premium Note — рекомендация специалиста */}
        <div className="max-w-2xl mx-auto mb-12 p-6 border-l-4 border-[#B8A99A] bg-[#FAF8F6] shadow-sm">
          <p className="text-xs text-[#B8A99A] tracking-widest uppercase mb-2">📋 Nota de tu especialista</p>
          <p className="font-serif text-lg text-[#3D3D3D] italic mb-4">
            "Para mantener tu keratina hasta 6 meses, necesitas productos específicos sin sulfatos."
          </p>
          <ul className="space-y-2 text-sm text-[#666]">
            {[
              '💧 Lavar con agua tibia, nunca caliente',
              '✨ Mascarilla 1–2 veces por semana (5 min)',
              '🌡️ Termoprotector SIEMPRE antes del secador',
              '🚿 Esperar 72h antes del primer lavado',
              '🌿 Sin sulfatos, sin parabenos',
              '🌊 Aclarar bien después de la playa',
              '✂️ Revisión recomendada cada 3 meses',
              '💤 Almohada de seda para menos fricción',
            ].map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* KIT 90€ */}
        <div className="max-w-2xl mx-auto mb-10 p-6 border border-[#B8A99A] bg-[#FAF8F6]">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-[#B8A99A] text-white text-xs tracking-wider uppercase">
              Kit Homecare Completo
            </span>
            <span className="px-3 py-1 bg-[#3D3D3D] text-white text-xs tracking-wider">
              + REGALO incluido 🎁
            </span>
          </div>

          <p className="font-serif text-2xl text-[#3D3D3D] mb-2">90€</p>
          <p className="text-sm text-[#666] mb-4">
            Incluye: champú, acondicionador, mascarilla y termoprotector profesionales.
          </p>

          {/* Бонус */}
          <div className="p-4 bg-white border border-[#E8E4E0] mb-4">
            <p className="text-sm font-medium text-[#3D3D3D] mb-1">🎁 Tu regalo con el Kit:</p>
            <p className="text-sm text-[#666]">
              Análisis gratuito de tu cuero cabelludo con <strong>tricoscopio profesional</strong> + selección personalizada de productos según tu tipo de cabello.{' '}
              <em>(El pago y recogida se realizan en el salón.)</em>
            </p>
          </div>

          {/* Кнопка — условная логика */}
          <Link
            to={user ? '/booking' : '/login'}
            className="block text-center py-3 bg-[#B8A99A] text-white text-sm tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors"
          >
            {user ? 'Reservar mi Kit' : 'Inicia sesión para reservar'}
          </Link>
          {!user && (
            <p className="text-center text-xs text-[#999] mt-2">
              Necesitas cuenta para reservar → solo tarda 30 segundos
            </p>
          )}
        </div>

        {/* 4 ПРОДУКТА ПО ОТДЕЛЬНОСТИ */}
        <h3 className="text-center font-serif text-xl text-[#3D3D3D] mb-6">
          O reserva por separado
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {INDIVIDUAL_PRODUCTS.map((p) => (
            <div key={p.name} className="p-4 border border-[#E8E4E0] bg-white text-center hover:border-[#B8A99A] transition-colors">
              <div className="text-3xl mb-2">{p.emoji}</div>
              <p className="text-sm font-medium text-[#3D3D3D] mb-1">{p.name}</p>
              <p className="text-[#B8A99A] font-serif text-lg mb-3">{p.price}</p>
              <Link
                to={user ? '/booking' : '/login'}
                className="block py-2 border border-[#B8A99A] text-[#B8A99A] text-xs tracking-wider uppercase hover:bg-[#B8A99A] hover:text-white transition-colors"
              >
                {user ? 'Reservar' : 'Entrar'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. PRECIOS BANNER — вставить НАД таблицей цен
// ─────────────────────────────────────────────────────────────
export function PreciosBanner() {
  return (
    // h-32 lg:h-44 — высота баннера (мобиле / десктоп)
    // Замени style с background на реальное фото:
    // style={{ backgroundImage: "url('/images/precios-banner.jpg')" }}
    <div
      className="relative w-full h-32 lg:h-44 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4a3b32 0%, #6b5344 50%, #8B7355 100%)' }}
    >
      {/* Тёмный градиент снизу */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Текст по центру */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <p className="font-serif text-2xl lg:text-3xl tracking-widest mb-1">Keratin Madrid</p>
        <p className="text-xs lg:text-sm tracking-[0.3em] uppercase text-white/80">
          Precios transparentes, sin sorpresas
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. ANTES / DESPUÉS SECTION
// ─────────────────────────────────────────────────────────────
export function AntesDespuesSection() {
  // 4 карточки — замени градиенты на реальные фото
  const PHOTOS = [
    { label: 'Keratina Brasileña', before: 'Rizado difícil', after: 'Liso perfecto' },
    { label: 'Botox Capilar',      before: 'Frizz intenso',  after: 'Brillante y suave' },
    { label: 'Alisado Orgánico',   before: 'Ondas rebeldes', after: 'Natural y liso' },
    { label: 'Nanoplastia',        before: 'Cabello seco',   after: 'Hidratado y liso' },
  ];

  const COLORS = [
    'from-[#6b5344] to-[#B8A99A]',
    'from-[#4a3b32] to-[#8B7355]',
    'from-[#8B7355] to-[#B8A99A]',
    'from-[#3D3D3D] to-[#6b5344]',
  ];

  return (
    <section id="resultados" className="py-16 lg:py-24 bg-[#FAF8F6]">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#B8A99A]/10 text-[#B8A99A] text-xs tracking-[0.3em] uppercase rounded-full mb-4">
            Resultados
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-[#3D3D3D] mb-4">Antes & Después</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#B8A99A] to-transparent mx-auto" />
        </div>

        {/* Сетка фото */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {PHOTOS.map((p, i) => (
            // group — активирует hover эффект на дочерних элементах
            <div key={p.label} className="group relative aspect-[3/4] overflow-hidden cursor-pointer">
              {/* Фото-заглушка (заменить на <img src="..." />) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[i]}`} />

              {/* Hover оверлей */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  VER
                </span>
              </div>

              {/* Инфо внизу */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-xs font-medium">{p.label}</p>
                <p className="text-white/70 text-xs">{p.before} → {p.after}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://www.instagram.com/keratinmadrid"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border border-[#B8A99A] text-[#B8A99A] text-sm tracking-widest uppercase hover:bg-[#B8A99A] hover:text-white transition-colors"
          >
            Ver más en Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. REVIEWS SECTION — аккордеон (pure CSS, no library)
// ─────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Laura M.',   stars: 5, service: 'Keratina Brasileña', text: 'Increíble resultado. Mi pelo quedó perfecto durante 5 meses. El trato fue excelente y el ambiente muy relajante.' },
  { name: 'Sofía G.',   stars: 5, service: 'Botox Capilar',       text: 'La mejor decisión que he tomado para mi cabello. Nota la diferencia desde el primer día. Totalmente recomendado.' },
  { name: 'Carmen R.',  stars: 5, service: 'Alisado Orgánico',    text: 'Me explicaron todo el proceso con detalle. El resultado fue natural y duradero. Volveré sin duda.' },
  { name: 'Ana P.',     stars: 4, service: 'Nanoplastia',         text: 'Excelente profesionalidad. Mi cabello está más hidratado y manejable. El ambiente es muy agradable.' },
  { name: 'Marta L.',   stars: 5, service: 'Keratina Express',    text: 'Vine con mucho frizz y salí con el pelo liso y brillante. Precio muy razonable para la calidad.' },
];

export function ReviewsSection() {
  // null = все закрыты, число = индекс открытого
  // По умолчанию 0 = первый отзыв открыт
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="opiniones" className="py-16 lg:py-24 bg-white">
      <div className="max-w-2xl mx-auto px-4">

        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#B8A99A]/10 text-[#B8A99A] text-xs tracking-[0.3em] uppercase rounded-full mb-4">
            Opiniones
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-[#3D3D3D] mb-4">Lo que dicen nuestras clientas</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#B8A99A] to-transparent mx-auto" />
        </div>

        <div className="space-y-2">
          {REVIEWS.map((r, i) => (
            <div key={r.name} className="border border-[#E8E4E0]">

              {/* Кликабельный заголовок отзыва */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#FAF8F6] transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {/* Аватар — первая буква имени */}
                <div className="w-10 h-10 rounded-full bg-[#B8A99A]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#B8A99A] font-serif text-sm">{r.name[0]}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#3D3D3D]">{r.name}</span>
                    {/* Звёзды */}
                    <span className="text-[#B8A99A] text-xs">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                  </div>
                  <span className="text-xs text-[#999]">{r.service}</span>
                </div>

                {/* Стрелка — поворачивается при открытии */}
                <span className={`text-[#B8A99A] transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              {/* Текст отзыва — показывается только если open === i */}
              {open === i && (
                <div className="pl-16 pr-4 pb-4">
                  <p className="text-sm text-[#666] italic">"{r.text}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. BEAUTY SCRIPTS SECTION — для профессионалов
// Вставить ПОСЛЕ секции "formaciones" в части Profesionales
// ─────────────────────────────────────────────────────────────
export function BeautyScriptsSection() {
  const WA_MSG = encodeURIComponent('Hola! Me interesan los Beauty Scripts para mi salón 💼');
  const WA_URL = `https://wa.me/34600000000?text=${WA_MSG}`;

  return (
    <section id="scripts" className="py-16 lg:py-24 bg-[#FAF8F6]">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#B8A99A]/10 text-[#B8A99A] text-xs tracking-[0.3em] uppercase rounded-full mb-4">
            Para Profesionales
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-[#3D3D3D] mb-4">Beauty Scripts</h2>
          <p className="text-[#666] max-w-xl mx-auto">
            Guiones de venta probados para que consigas más clientes y cierres más tratamientos.
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#B8A99A] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Preview card */}
          <div className="bg-gradient-to-br from-[#4a3b32] to-[#6b5344] p-8 flex items-center justify-center min-h-[280px]">
            <div className="text-center text-white">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-serif text-xl tracking-wide mb-2">Beauty Scripts</p>
              <p className="text-white/70 text-sm">Guiones profesionales para tu salón</p>
            </div>
          </div>

          {/* Контент */}
          <div className="flex flex-col justify-center">
            <div className="space-y-4 mb-6">
              {[
                { emoji: '⏱️', title: 'Ahorra tiempo', desc: 'Scripts listos para usar, sin improvisar' },
                { emoji: '😌', title: 'Reduce el estrés', desc: 'Sabe exactamente qué decir ante objeciones' },
                { emoji: '💰', title: '+40% conversiones', desc: 'Probados en salones reales con resultados' },
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <span className="text-2xl">{b.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-[#3D3D3D]">{b.title}</p>
                    <p className="text-sm text-[#666]">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-[#3D3D3D] mb-2">Incluye:</p>
              <ul className="space-y-1">
                {[
                  'Script para vender keratina brasileña',
                  'Script para botox capilar',
                  'Respuestas a las 5 objeciones más comunes',
                  'Versión WhatsApp y versión presencial',
                  'Actualizaciones gratuitas',
                ].map((item) => (
                  <li key={item} className="text-sm text-[#666] flex items-center gap-2">
                    <span className="text-[#B8A99A]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-3 bg-[#B8A99A] text-white text-sm tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors"
            >
              Quiero mis Scripts →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
