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
    <div className="min-h-screen bg-[#FAF8F6]">

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden flex flex-col">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Keratin Madrid"
            className="w-full h-full object-cover object-[center_20%] lg:object-center"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D2A26]/50 via-transparent to-[#2D2A26]/70 lg:bg-gradient-to-t lg:from-[#2D2A26]/60 lg:via-[#2D2A26]/15 lg:to-transparent" />
        </div>

        {/* Mobile Hero */}
        <div className="lg:hidden relative z-10 flex flex-col h-screen">
          <div className="pt-24 px-6 text-center">
            <p className="text-[#D4C8BA] text-[10px] tracking-[0.4em] uppercase mb-4 font-light">Madrid</p>
            <h1 className="font-serif text-4xl font-light tracking-wide text-white mb-4">
              Keratin Madrid
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C4A484] to-transparent mx-auto" />
          </div>

          <div className="flex-1" />

          <div className="px-6 pb-12">
            <p className="text-lg font-serif font-light tracking-wide text-white/95 text-center mb-2">
              Estudio de salud y belleza capilar
            </p>
            <p className="text-sm font-light leading-relaxed text-white/70 text-center mb-8 max-w-[280px] mx-auto">
              Alisado sin dano, reconstruccion real y brillo desde la primera sesion.
            </p>

            <div className="flex flex-col gap-3 max-w-[280px] mx-auto mb-8">
              {user ? (
                <Link to="/booking"
                  className="w-full py-4 bg-[#C4A484] text-white tracking-[0.2em] font-medium text-[10px] uppercase text-center">
                  Reservar Cita
                </Link>
              ) : (
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 bg-[#C4A484] text-white tracking-[0.2em] font-medium text-[10px] uppercase text-center block">
                  Reservar Cita
                </a>
              )}
              <button onClick={() => scrollTo('servicios')}
                className="w-full py-3 border border-white/40 text-white/90 tracking-[0.15em] font-light text-[10px] uppercase">
                Ver Servicios
              </button>
            </div>

            <div className="flex justify-center gap-6">
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                </svg>
              </a>
              <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/>
                </svg>
              </a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Hero */}
        <div className="hidden lg:flex relative z-10 container mx-auto px-8 pb-28 items-end flex-1">
          <div className="max-w-2xl">
            <p className="text-[#C4A484] text-[11px] tracking-[0.3em] uppercase mb-4 font-light">Madrid, Espana</p>
            <h1 className="font-serif text-5xl xl:text-6xl font-light mb-5 tracking-wide text-white">
              Keratin Madrid
            </h1>
            <p className="text-xl font-light mb-4 tracking-wide text-white/90">
              Estudio de salud y belleza capilar
            </p>
            <p className="text-base font-light mb-10 leading-relaxed text-white/75 max-w-xl">
              Alisado sin dano, reconstruccion real y brillo espejo desde la primera sesion.
              Diagnostico y protocolo 100% personalizados.
            </p>
            <div className="flex gap-4">
              {user ? (
                <Link to="/booking"
                  className="px-8 py-3.5 bg-[#C4A484] text-white tracking-[0.15em] text-[11px] uppercase hover:bg-[#8B7355] transition-colors">
                  Reservar Cita
                </Link>
              ) : (
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-[#C4A484] text-white tracking-[0.15em] text-[11px] uppercase hover:bg-[#8B7355] transition-colors">
                  Reservar Cita
                </a>
              )}
              <button onClick={() => scrollTo('servicios')}
                className="px-8 py-3.5 border border-white/40 text-white tracking-[0.15em] text-[11px] uppercase hover:bg-white/10 transition-colors">
                Ver Servicios
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button onClick={() => scrollTo('inicio')}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors hidden lg:block">
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19 9-7 7-7-7"/>
          </svg>
        </button>
      </section>

      {/* Sections */}
      <PorQueElegirSection />
      <TratamientosSection />
      <TablaDePreciosSection />
      <AntesDespuesSection />
      <ReviewsSection />
      <HomecareSection />
      <FormacionesSection />
      <BeautyScriptsSection />

      {/* Contact CTA Section */}
      <section className="bg-[#2D2A26] py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#C4A484] mb-4">Contacto</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Reserva tu cita</h2>
              <p className="text-[#9A938A] mb-6 leading-relaxed">
                Estamos en Madrid, Espana. Contactanos para reservar tu cita y comenzar tu transformacion capilar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                {user ? (
                  <Link to="/booking"
                    className="px-8 py-3.5 bg-[#C4A484] text-white text-[11px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors">
                    Reservar Cita
                  </Link>
                ) : (
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                    className="px-8 py-3.5 bg-[#C4A484] text-white text-[11px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors text-center">
                    Contactar por WhatsApp
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2 text-sm text-[#9A938A]">
                <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4A484] transition-colors">
                  +34 641 26 15 59
                </a>
                <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#C4A484] transition-colors">
                  @keratin_madrid
                </a>
              </div>
            </div>
            
            {/* Right: Google Map */}
            <div className="w-full h-[280px] lg:h-[320px] bg-[#1a1816] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194347.38440883868!2d-3.8196207!3d40.4381311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sMadrid%2C%20Spain!5e0!3m2!1sen!2sus!4v1706000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Keratin Madrid Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1D1A] text-[#6B635A] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <p className="font-serif text-white text-base mb-3">Keratin Madrid</p>
              <p className="text-xs leading-relaxed">Estudio de salud y belleza capilar. Madrid, Espana.</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A938A] mb-4">Navegacion</p>
              <div className="flex flex-col gap-2 text-xs">
                <button onClick={() => scrollTo('inicio')} className="text-left hover:text-[#C4A484] transition-colors">Inicio</button>
                <button onClick={() => scrollTo('precios')} className="text-left hover:text-[#C4A484] transition-colors">Precios</button>
                <button onClick={() => scrollTo('homecare')} className="text-left hover:text-[#C4A484] transition-colors">Homecare</button>
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A938A] mb-4">Profesionales</p>
              <div className="flex flex-col gap-2 text-xs">
                <button onClick={() => scrollTo('formaciones')} className="text-left hover:text-[#C4A484] transition-colors">Formaciones</button>
                <button onClick={() => scrollTo('scripts')} className="text-left hover:text-[#C4A484] transition-colors">Beauty Scripts</button>
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A938A] mb-4">Contacto</p>
              <div className="flex flex-col gap-2 text-xs">
                <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#C4A484] transition-colors">@keratin_madrid</a>
                <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4A484] transition-colors">+34 641 26 15 59</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#2D2A26] pt-6 text-center text-[10px] text-[#4A453F]">
            2025 Keratin Madrid. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
