// frontend/src/pages/HomePage.tsx — v4
// CAMBIOS v4:
//   - Hero: top-center (no centro vertical), tamaño moderado, 1 línea
//   - Footer: navegación igual que navbar (Inicio, Precios, Homecare, Para Profesionales)
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import {
  PorQueElegirSection,
  TratamientosSection,
  TablaDePreciosSection,
  AntesDespuesSection,
  ReviewsSection,
  HomecareSection,
  FormacionesSection,
  BeautyScriptsSection,
} from '../components/HomePageSections';

const WA_URL = 'https://wa.me/34641261559?text=Hola!%20Quiero%20reservar%20una%20cita';
const IG_URL = 'https://www.instagram.com/keratin_madrid';
const TK_URL = 'https://www.tiktok.com/@keratin_madrid';

export default function HomePage() {
  const user = useAppSelector((s) => s.auth.user);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ═══════════════════════════════════════
          HERO — top-center, tamaño moderado
          "Keratin Madrid" en UNA línea
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden flex flex-col">

        {/* Foto de fondo */}
        <div className="absolute inset-0">
          <img
            src="/images/image0.jpg"
            alt="Keratin Madrid"
            className="w-full h-full object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Overlay suave */}
          <div className="absolute inset-0 bg-[#FAF8F5]/50" />
        </div>

        {/* ✅ Contenido en la parte superior centrado
            pt-28 = deja espacio para el navbar (h-16/h-20) */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-28 sm:pt-32 lg:pt-36 w-full max-w-4xl mx-auto">

          {/* Etiqueta */}
          <p className="text-[11px] tracking-[0.4em] uppercase text-[#8B7355] mb-6 md:mb-8">
            Madrid · España
          </p>

          {/* ✅ Título: UNA línea, tamaño moderado, whitespace-nowrap */}
          <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-[#3d3530] tracking-tight leading-none mb-5 md:mb-6 whitespace-nowrap">
            Keratin Madrid
          </h1>

          {/* Subtítulo */}
          <p className="text-sm sm:text-base md:text-lg text-[#5a5045] tracking-[0.12em] uppercase mb-4 md:mb-5">
            Estudio de salud y belleza capilar
          </p>

          {/* Descripción */}
          <p className="text-sm sm:text-base text-[#8B7355] max-w-md mx-auto mb-8 md:mb-10 leading-relaxed">
            Alisado sin dañar, reconstrucción real y brillo espejo desde la primera sesión.
            Diagnóstico y protocolo 100% personalizados.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {user ? (
              <Link to="/booking"
                className="px-8 py-3.5 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors">
                Reservar Cita
              </Link>
            ) : (
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors">
                Reservar Cita
              </a>
            )}
            <button
              onClick={() => scrollTo('servicios')}
              className="px-8 py-3.5 border border-[#B8A99A] text-[#B8A99A] text-[12px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all duration-300">
              Ver Servicios
            </button>
          </div>
        </div>

        {/* Scroll indicator — abajo */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-10">
          <svg className="w-4 h-4 text-[#B8A99A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19 9-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* SECCIONES */}
      <PorQueElegirSection />
      <TratamientosSection />
      <TablaDePreciosSection />
      <AntesDespuesSection />
      <ReviewsSection />
      <HomecareSection user={user} />
      <FormacionesSection />
      <BeautyScriptsSection />

      {/* CTA final */}
      <section className="bg-[#3d3530] py-20 lg:py-28">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8A99A] mb-6">Contacto</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-5">Reserva tu cita</h2>
          <p className="text-base md:text-lg text-[#c0b8b0] mb-10">
            Estamos en Madrid, España. Contáctanos por WhatsApp para reservar.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block px-12 py-4 border border-[#B8A99A] text-[#B8A99A] text-[12px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all duration-300">
            Contactar por WhatsApp
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER — navegación igual que navbar:
          Inicio | Precios | Homecare | Para Profesionales (Formaciones, Beauty Scripts)
      ═══════════════════════════════════════ */}
      <footer className="bg-[#2d2520] text-[#8a8078] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

            {/* Columna 1: Brand */}
            <div className="lg:col-span-1">
              <p className="font-serif text-white text-lg mb-3">Keratin Madrid</p>
              <p className="text-sm leading-relaxed">Estudio de salud y belleza capilar. Madrid, España.</p>
              <div className="flex gap-4 mt-4">
                <a href={IG_URL} target="_blank" rel="noopener noreferrer"
                  className="text-[#8a8078] hover:text-[#B8A99A] transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href={TK_URL} target="_blank" rel="noopener noreferrer"
                  className="text-[#8a8078] hover:text-[#B8A99A] transition-colors" aria-label="TikTok">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* ✅ Columna 2: Navegación — igual que navbar */}
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-4">Navegación</p>
              <div className="flex flex-col gap-2.5 text-sm">
                <button onClick={() => scrollTo('inicio')} className="text-left hover:text-[#B8A99A] transition-colors">
                  Inicio
                </button>
                <button onClick={() => scrollTo('precios')} className="text-left hover:text-[#B8A99A] transition-colors">
                  Precios
                </button>
                <button onClick={() => scrollTo('homecare')} className="text-left hover:text-[#B8A99A] transition-colors">
                  Homecare
                </button>
              </div>
            </div>

            {/* ✅ Columna 3: Para Profesionales — igual que dropdown navbar */}
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-4">Para Profesionales</p>
              <div className="flex flex-col gap-2.5 text-sm">
                <button onClick={() => scrollTo('formaciones')} className="text-left hover:text-[#B8A99A] transition-colors">
                  Formaciones
                </button>
                <button onClick={() => scrollTo('scripts')} className="text-left hover:text-[#B8A99A] transition-colors">
                  Beauty Scripts
                </button>
              </div>
            </div>

            {/* Columna 4: Contacto */}
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-4">Contacto</p>
              <div className="flex flex-col gap-2.5 text-sm">
                <a href={IG_URL} target="_blank" rel="noopener noreferrer"
                  className="hover:text-[#B8A99A] transition-colors">@keratin_madrid</a>
                <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer"
                  className="hover:text-[#B8A99A] transition-colors">+34 641 26 15 59</a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#3d3530] pt-6 text-center text-xs text-[#6a6060]">
            © 2025 Keratin Madrid. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
