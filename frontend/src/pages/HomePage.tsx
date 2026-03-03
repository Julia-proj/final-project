// ============================================================
// pages/HomePage.tsx
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import {
  HomecareSection,
  PreciosBanner,
  AntesDespuesSection,
  ReviewsSection,
  BeautyScriptsSection,
} from '../components/HomePageSections';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const PRECIOS = {
  keratina: [
    { length: '20-30 cm', price: '180€' },
    { length: '30-40 cm', price: '200€' },
    { length: '40-50 cm', price: '220€' },
    { length: '50-60 cm', price: '240€' },
    { length: '60-70 cm', price: '260€' },
    { length: '70-80 cm', price: '280€' },
  ],
  reconstruccion: [
    { length: '20-30 cm', price: '110€' },
    { length: '30-40 cm', price: '120€' },
    { length: '40-50 cm', price: '140€' },
    { length: '50-60 cm', price: '160€' },
    { length: '60+ cm',   price: '200€' },
  ],
};

export default function HomePage() {
  const [pricingTab, setPricingTab] = useState<'keratina' | 'reconstruccion'>('keratina');
  const user = useAppSelector((state) => state.auth.user);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen">

      {/* ════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-[#4a3b32] via-[#6b5344] to-[#8B7355]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
        </div>

        <div className="relative z-10 flex flex-col justify-end flex-1 px-6 pb-16 lg:px-16 lg:pb-24">
          <div className="max-w-2xl">
            <p className="text-[#D4C5B5] text-xs tracking-[0.5em] uppercase mb-4 font-light">
              Madrid · España
            </p>
            <h1 className="font-serif text-5xl lg:text-7xl font-light text-white mb-4 tracking-wide">
              Keratin Madrid
            </h1>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4C5B5] to-transparent mb-6" />
            <p className="text-xl font-light text-white/90 mb-3">
              Estudio de salud y belleza capilar
            </p>
            <p className="text-base font-light text-white/70 mb-8 max-w-xl leading-relaxed">
              Alisado sin dañar, reconstrucción real y brillo espejo desde la primera sesión.
              Diagnóstico y protocolo 100% personalizados.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('servicios')}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-xs tracking-widest uppercase font-medium hover:bg-white hover:text-[#3D3D3D] transition-all"
              >
                SERVICIOS & PRECIOS
              </button>
              {user ? (
                <Link
                  to="/booking"
                  className="px-6 py-3 bg-[#B8A99A] text-white text-xs tracking-widest uppercase font-medium hover:bg-[#9A8B7A] transition-all"
                >
                  RESERVAR CITA
                </Link>
              ) : (
                <a
                  href="https://wa.me/34641261559"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#B8A99A] text-white text-xs tracking-widest uppercase font-medium hover:bg-[#9A8B7A] transition-all"
                >
                  CONTACTAR
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 lg:right-12 z-10 flex gap-4">
          <a href="https://www.instagram.com/keratin_madrid" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
          </a>
          <a href="https://www.tiktok.com/@keratin_madrid" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <TikTokIcon className="w-5 h-5" />
          </a>
        </div>
      </section>

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          BENEFICIOS
          ════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-[#FAF8F6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
              <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">Beneficios</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#3D3D3D] mb-3">
              ¿Por qué elegir Keratin Madrid?
            </h2>
            <p className="text-[#666666] font-light max-w-xl mx-auto">
              Nos diferenciamos por nuestro enfoque en la salud capilar y resultados duraderos
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🔬', title: 'Diagnóstico con tricóscopo', desc: 'Analizamos cabello y cuero cabelludo antes de elegir cualquier protocolo.' },
              { emoji: '💧', title: 'Protocolos exclusivos', desc: 'Tecnología premium anti-daño que no quema, no reseca y no daña.' },
              { emoji: '⭐', title: 'Servicio de alto nivel', desc: 'Experiencia cómoda, atención a los detalles y trato personalizado.' },
              { emoji: '✨', title: 'Seguimiento y cuidado', desc: 'Plan claro para prolongar los resultados al máximo.' },
              { emoji: '🔄', title: 'Corrección de hábitos', desc: 'Ajustamos hábitos sencillos que marcan la diferencia.' },
              { emoji: '🌿', title: 'Cabello más fuerte', desc: 'Trabajamos para meses, no para un día. Resultados duraderos.' },
            ].map((b, i) => (
              <div key={i} className="text-center p-5 rounded-xl hover:-translate-y-1 hover:bg-white transition-all duration-300">
                <div className="text-3xl mb-3">{b.emoji}</div>
                <h3 className="font-serif font-medium text-[#3D3D3D] mb-2 text-sm lg:text-base">{b.title}</h3>
                <p className="text-[#666666] font-light text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          SERVICIOS (id="servicios")
          ════════════════════════════════════════════════════ */}
      <section id="servicios" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
              <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">Servicios</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#3D3D3D] mb-3">Tratamientos</h2>
            <p className="text-[#666666] font-light">Tratamientos profesionales adaptados a tu tipo de cabello</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                tag: 'Bestseller',
                title: 'Alisado de Keratina',
                subtitle: '3-6 meses de duración',
                desc: 'Alisado seguro, sin formol ni olores fuertes. Adaptado al diagnóstico previo de cada tipo de cabello.',
                benefits: ['Reduce frizz y encrespamiento', 'Brillo espejo duradero', 'Más disciplina y suavidad natural', 'Ahorro de tiempo al peinar'],
                gradient: 'from-[#4a3b32] to-[#7a6254]',
              },
              {
                tag: 'Reparador',
                title: 'Reconstrucción en frío',
                subtitle: 'Resultado acumulativo',
                desc: 'Recuperación profunda sin alisar. Restaura fuerza, densidad y elasticidad del cabello.',
                benefits: ['Reposición de proteínas y lípidos', 'Reduce rotura', 'Mejora textura y brillo', 'Compatible con decoloraciones'],
                gradient: 'from-[#3d5a4a] to-[#5a7a6a]',
              },
              {
                tag: 'Detox',
                title: 'Peeling Capilar',
                subtitle: 'Limpieza profunda + diagnóstico',
                desc: 'Limpieza profunda con diagnóstico mediante tricóscopo.',
                benefits: ['Elimina grasa y residuos', 'Activa la circulación', 'Previene caspa y picor', 'Mejora la oxigenación'],
                gradient: 'from-[#4a4a3d] to-[#6a6a5a]',
              },
              {
                tag: 'Relax',
                title: 'Head Spa',
                subtitle: 'Ritual de bienestar',
                desc: 'Ritual de salud y relax con masaje y productos profesionales.',
                benefits: ['Activa la microcirculación', 'Nutre el folículo', 'Reduce estrés y tensión', 'Favorece el crecimiento'],
                gradient: 'from-[#3d4a4a] to-[#5a6a7a]',
              },
            ].map((service, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className={`h-48 bg-gradient-to-br ${service.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-px w-6 bg-[#B8A99A]" />
                      <span className="text-[#B8A99A] text-xs tracking-widest uppercase">{service.tag}</span>
                    </div>
                    <h3 className="font-serif text-xl text-white">{service.title}</h3>
                    <p className="text-white/60 text-sm font-light">{service.subtitle}</p>
                  </div>
                </div>
                <div className="p-5 bg-white">
                  <p className="text-[#666666] font-light text-sm mb-3">{service.desc}</p>
                  <ul className="space-y-1 mb-4">
                    {service.benefits.map((b, j) => (
                      <li key={j} className="flex items-center text-sm text-[#666666]">
                        <span className="text-[#B8A99A] mr-2">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                  {user ? (
                    <Link to="/booking" className="btn-primary text-xs">RESERVAR</Link>
                  ) : (
                    <button onClick={() => scrollTo('precios')} className="btn-primary text-xs">VER PRECIO</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          PRECIOS (id="precios")
          ════════════════════════════════════════════════════ */}
      <section id="precios" className="py-16 lg:py-24 bg-[#FAF8F6]">
        <div className="max-w-4xl mx-auto px-6">

          {/* ── НОВЫЙ БАННЕР над таблицей цен ── */}
          <PreciosBanner />

          <div className="text-center mb-12 mt-10">
            <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
              <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">Precios</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#3D3D3D] mb-3">Tabla de Precios</h2>
            <p className="text-[#666666] font-light">Precios transparentes adaptados a la longitud de tu cabello</p>
          </div>

          {/* Tabs */}
          <div className="flex border border-[#E8E4E0] rounded-lg p-1 bg-white mb-6">
            {(['keratina', 'reconstruccion'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPricingTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                  pricingTab === tab
                    ? 'bg-white text-[#9A8B7A] shadow-sm'
                    : 'text-[#666666] hover:text-[#B8A99A]'
                }`}
              >
                {tab === 'keratina' ? 'Keratina & Botox' : 'Reconstrucción'}
              </button>
            ))}
          </div>

          {/* Таблица */}
          <div className="card">
            <div className="divide-y divide-[#E8E4E0]">
              {PRECIOS[pricingTab].map((item, i) => (
                <div key={i} className={`flex justify-between items-center py-3 px-2 ${i % 2 === 1 ? 'bg-[#FAF8F6]' : ''}`}>
                  <span className="text-[#666666]">{item.length}</span>
                  <span className="font-semibold text-[#3D3D3D]">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#E8E4E0] text-sm text-[#666666]">
              <p className="mb-1"><strong className="text-[#3D3D3D]">Cabello abundante:</strong> +20€ (7cm) · +40€ (9cm) · +60€ (10+cm)</p>
              <p><strong className="text-[#3D3D3D]">Extras:</strong> Peeling anticaspa +65€ · Nano Gold +50€ · Corte puntas +20€</p>
            </div>
            <div className="mt-6">
              {user ? (
                <Link to="/booking" className="btn-primary w-full block text-center">RESERVAR MI CITA</Link>
              ) : (
                <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="btn-primary w-full block text-center">CALCULAR MI PRECIO EN WHATSAPP</a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          HOMECARE (id="homecare") — НОВЫЙ КОМПОНЕНТ
          ════════════════════════════════════════════════════ */}
      <HomecareSection user={user} />

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          ANTES / DESPUÉS — НОВЫЙ КОМПОНЕНТ (id="resultados")
          ════════════════════════════════════════════════════ */}
      <AntesDespuesSection />

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          OPINIONES — НОВЫЙ КОМПОНЕНТ (id="opiniones")
          ════════════════════════════════════════════════════ */}
      <ReviewsSection />

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          FORMACIONES (id="formaciones")
          ════════════════════════════════════════════════════ */}
      <section id="formaciones" className="py-16 lg:py-24 bg-[#FAF8F6]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
              <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">Para Profesionales</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#3D3D3D] mb-3">Formaciones</h2>
            <p className="text-[#666666] font-light">Aprende técnicas profesionales de tratamiento capilar</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card border-2 border-[#B8A99A]/30">
              <span className="inline-block px-3 py-1 bg-[#B8A99A] text-white text-xs rounded-full mb-4 font-medium">Curso destacado</span>
              <h3 className="font-serif text-xl font-medium text-[#3D3D3D] mb-1">Curso intensivo de keratina</h3>
              <p className="text-[#666666] font-light text-sm mb-4">Formación completa para profesionales · 2 días</p>
              <ul className="space-y-2 mb-5">
                {['Diagnóstico tricoscópico', 'Técnicas de aplicación', 'Práctica con modelos', 'Manual PDF completo', 'Certificado de asistencia', 'Soporte 2 semanas'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-[#666666]">
                    <span className="text-[#B8A99A] mr-2">✓</span> {item}
                  </li>
                ))}
              </ul>
              <p className="font-serif text-3xl text-[#9A8B7A] mb-4">1.400€</p>
              <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="btn-primary w-full block text-center text-xs">RESERVAR PLAZA</a>
            </div>

            <div className="card">
              <span className="inline-block px-3 py-1 bg-[#9A8B7A] text-white text-xs rounded-full mb-4 font-medium">Masterclass</span>
              <h3 className="font-serif text-xl font-medium text-[#3D3D3D] mb-1">Reconstrucción en Frío</h3>
              <p className="text-[#666666] font-light text-sm mb-4">Para profesionales que buscan especialización</p>
              <ul className="space-y-2 mb-5">
                {['Técnicas avanzadas', 'Grupos reducidos (máx. 6)', 'Material incluido', 'Guía completa PDF', 'Certificado de asistencia'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-[#666666]">
                    <span className="text-[#B8A99A] mr-2">✓</span> {item}
                  </li>
                ))}
              </ul>
              <p className="font-serif text-3xl text-[#9A8B7A] mb-1">350€</p>
              <p className="text-xs text-[#666666] mb-4">Grupo mínimo de 3 personas · por persona</p>
              <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="btn-primary w-full block text-center text-xs">HABLAR POR WHATSAPP</a>
            </div>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          BEAUTY SCRIPTS — НОВЫЙ КОМПОНЕНТ (id="scripts")
          ════════════════════════════════════════════════════ */}
      <BeautyScriptsSection />

      <div className="gold-divider" />

      {/* ════════════════════════════════════════════════════
          CTA FINAL
          ════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
            <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">Contacto</span>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#3D3D3D] mb-4">Reserva tu cita</h2>
          <p className="text-[#666666] font-light mb-8">
            Estamos en Madrid, España. Contáctanos por WhatsApp o{' '}
            {user ? 'reserva directamente desde tu cuenta.' : 'crea tu cuenta para reservar online.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/34641261559"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              💬 CONTACTAR POR WHATSAPP
            </a>
            {!user && (
              <Link to="/register" className="px-6 py-3 border border-[#B8A99A] text-[#9A8B7A] text-sm tracking-widest uppercase font-medium hover:bg-[#B8A99A] hover:text-white transition-all rounded">
                CREAR CUENTA
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════ */}
      <footer className="py-12 bg-white border-t border-[#E8E4E0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#3D3D3D] mb-4">Contacto</h3>
              <a href="https://www.instagram.com/keratin_madrid" className="flex items-center gap-2 text-[#666666] hover:text-[#B8A99A] transition-colors mb-2 text-sm">
                📸 @keratin_madrid
              </a>
              <a href="https://wa.me/34641261559" className="flex items-center gap-2 text-[#666666] hover:text-[#B8A99A] transition-colors text-sm">
                💬 +34 641 26 15 59
              </a>
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#3D3D3D] mb-4">Navegación</h3>
              {[
                { label: 'Servicios',         id: 'servicios' },
                { label: 'Precios',           id: 'precios' },
                { label: 'Homecare',          id: 'homecare' },
                { label: 'Para Profesionales',id: 'formaciones' },
                { label: 'Resultados',        id: 'resultados' },
              ].map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="block text-[#666666] hover:text-[#B8A99A] transition-colors mb-2 text-sm">
                  {item.label}
                </button>
              ))}
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#3D3D3D] mb-4">Cuenta</h3>
              {user ? (
                <>
                  <Link to="/booking" className="block text-[#666666] hover:text-[#B8A99A] mb-2 text-sm">Mis reservas</Link>
                  {user.role === 'admin' && <Link to="/admin" className="block text-[#666666] hover:text-[#B8A99A] mb-2 text-sm">Panel Admin</Link>}
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-[#666666] hover:text-[#B8A99A] mb-2 text-sm">Entrar</Link>
                  <Link to="/register" className="block text-[#666666] hover:text-[#B8A99A] mb-2 text-sm">Crear cuenta</Link>
                </>
              )}
            </div>
          </div>
          <div className="gold-divider mb-6" />
          <p className="text-center text-[#999] text-sm">© 2025 Keratin Madrid. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
