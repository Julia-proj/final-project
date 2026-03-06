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

      <section className="relative min-h-screen overflow-hidden flex flex-col">

        {/* Hero background */}
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Keratin Madrid"
            className="w-full h-full object-cover object-[center_20%] lg:object-center"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 lg:bg-gradient-to-t lg:from-black/70 lg:via-black/20 lg:to-transparent" />
        </div>

        {/* MOBILE Hero Layout */}
        <div className="lg:hidden relative z-10 flex flex-col h-screen">
          {/* Top: logo + subtitle */}
          <div className="pt-28 px-6 text-center">
            <p className="text-white/80 text-[12px] tracking-[0.3em] uppercase mb-6 font-light">Madrid · Espana</p>
            <h1 className="font-serif text-6xl font-light tracking-wide text-white mb-6">
              Keratin Madrid
            </h1>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom: description + buttons */}
          <div className="px-6 pb-16">
            <p className="text-2xl font-serif font-light tracking-wide text-white/95 text-center mb-4">
              Estudio de salud y belleza capilar
            </p>
            <p className="text-base font-light leading-relaxed text-white/75 text-center mb-10 max-w-[320px] mx-auto">
              Alisado sin danar, reconstruccion real y brillo espejo desde la primera sesion. Diagnostico y protocolo 100% personalizados.
            </p>

            <div className="flex flex-col gap-4 max-w-[340px] mx-auto mb-8">
              {user ? (
                <Link to="/booking"
                  className="w-full py-4 bg-white text-[#3D3D3D] tracking-[0.15em] font-light text-[12px] uppercase text-center shadow-lg hover:shadow-xl transition-shadow">
                  Reservar Cita
                </Link>
              ) : (
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 bg-white text-[#3D3D3D] tracking-[0.15em] font-light text-[12px] uppercase text-center shadow-lg hover:shadow-xl transition-shadow block">
                  Reservar Cita
                </a>
              )}
              <button onClick={() => scrollTo('servicios')}
                className="w-full py-4 border border-white/60 text-white/90 tracking-[0.15em] font-light text-[11px] uppercase hover:bg-white/10 transition-all">
                Ver Servicios
              </button>
            </div>

            {/* Social icons */}
            <div className="flex justify-center gap-8">
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                </svg>
              </a>
              <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/>
                </svg>
              </a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* DESKTOP Hero Layout */}
        <div className="hidden lg:flex relative z-10 container mx-auto px-12 pb-32 items-end flex-1">
          <div className="max-w-3xl">
            <h1 className="font-serif text-7xl lg:text-8xl font-light mb-8 tracking-wide text-white">
              Keratin Madrid
            </h1>
            <p className="text-3xl font-light mb-4 tracking-wide text-white/95">
              Estudio de salud y belleza capilar
            </p>
            <p className="text-xl font-light mb-12 leading-relaxed text-white/80 max-w-3xl">
              Alisado sin danar, reconstruccion real y brillo espejo desde la primera sesion.
              Diagnostico y protocolo 100% personalizados.
            </p>
            <div className="flex gap-5">
              {user ? (
                <Link to="/booking"
                  className="px-10 py-4 bg-white/95 backdrop-blur-sm text-[#3D3D3D] tracking-[0.15em] text-sm font-light uppercase hover:bg-white transition-all">
                  RESERVAR CITA
                </Link>
              ) : (
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="px-10 py-4 bg-white/95 backdrop-blur-sm text-[#3D3D3D] tracking-[0.15em] text-sm font-light uppercase hover:bg-white transition-all">
                  RESERVAR CITA
                </a>
              )}
              <button onClick={() => scrollTo('servicios')}
                className="px-10 py-4 border border-white/50 text-white tracking-[0.15em] text-sm font-light uppercase hover:bg-white/10 transition-all">
                VER SERVICIOS
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button onClick={() => scrollTo('inicio')}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white animate-bounce hidden lg:block">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19 9-7 7-7-7"/>
          </svg>
        </button>
      </section>

      {/* SECTIONS */}
      <PorQueElegirSection />
      <TratamientosSection />
      <TablaDePreciosSection />
      <AntesDespuesSection />
      <ReviewsSection />
      <HomecareSection />
      <FormacionesSection />
      <BeautyScriptsSection />

      {/* CTA final */}
      <section className="bg-[#3d3530] py-20 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#B8A99A] mb-6 font-light">Contacto</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-light tracking-wide">Reserva tu cita</h2>
          <p className="text-lg md:text-xl text-[#c0b8b0] mb-10 font-light leading-relaxed">
            Estamos en Madrid, Espana. Contactanos para reservar tu tratamiento personalizado.
          </p>
          {user ? (
            <Link to="/booking"
              className="inline-block px-12 py-4 border border-[#B8A99A] text-[#B8A99A] text-[13px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all font-light">
              Reservar Cita
            </Link>
          ) : (
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="inline-block px-12 py-4 border border-[#B8A99A] text-[#B8A99A] text-[13px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all font-light">
              Contactar por WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2d2520] text-[#9a8f87] py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 mb-10">
            <div>
              <p className="font-serif text-white text-lg mb-3 font-light">Keratin Madrid</p>
              <p className="text-sm leading-relaxed font-light">Estudio de salud y belleza capilar. Madrid, Espana.</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-4 font-light">Navegacion</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <button onClick={() => scrollTo('inicio')} className="text-left hover:text-[#B8A99A] transition-colors">Inicio</button>
                <button onClick={() => scrollTo('precios')} className="text-left hover:text-[#B8A99A] transition-colors">Precios</button>
                <button onClick={() => scrollTo('homecare')} className="text-left hover:text-[#B8A99A] transition-colors">Homecare</button>
              </div>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-4 font-light">Para Profesionales</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <button onClick={() => scrollTo('formaciones')} className="text-left hover:text-[#B8A99A] transition-colors">Formaciones</button>
                <button onClick={() => scrollTo('scripts')} className="text-left hover:text-[#B8A99A] transition-colors">Beauty Scripts</button>
              </div>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-4 font-light">Contacto</p>
              <div className="flex flex-col gap-2.5 text-sm font-light">
                <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#B8A99A]">@keratin_madrid</a>
                <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="hover:text-[#B8A99A]">+34 641 26 15 59</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#3d3530] pt-8 text-center text-[12px] text-[#7a7070] font-light">
            2025 Keratin Madrid. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
