import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import {
  PorQueElegirSection,
  TratamientosSection,
  AntesDespuesSection,
  ReviewsSection,
  HomecareSection,
  FormacionesSection,
  BeautyScriptsSection,
  GoogleMapSection,
} from '../components/HomePageSections';
import InteractivePricing from '../components/InteractivePricing';

const WA_URL = 'https://wa.me/34641261559?text=Hola!%20Quiero%20reservar%20una%20cita';
const IG_URL = 'https://www.instagram.com/keratin_madrid';
const TK_URL = 'https://www.tiktok.com/@keratin_madrid';
const YT_URL = 'https://www.youtube.com/@keratinmadrid';

export default function HomePage() {
  const user = useAppSelector((s) => s.auth.user);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      <section className="relative min-h-screen overflow-hidden flex flex-col">

        {/* Hero background: video with image fallback */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero.jpg"
            className="w-full h-full object-cover object-[center_20%] lg:object-center"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <img
            src="/images/hero.jpg"
            alt="Keratin Madrid"
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] lg:object-center"
            style={{ display: 'none' }}
            onLoad={(e) => {
              const video = (e.target as HTMLImageElement).parentElement?.querySelector('video');
              if (video) video.addEventListener('error', () => { (e.target as HTMLImageElement).style.display = 'block'; });
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 lg:bg-none" />
          <div className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.35) 42%, rgba(0,0,0,0.05) 70%, transparent 100%)' }} />
        </div>

        {/* ── MOBILE Hero Layout ── */}
        <div className="lg:hidden relative z-10 flex flex-col h-screen">
          {/* Tagline pinned to very top */}
          <div className="absolute top-0 left-0 px-6 pt-3">
            <p className="text-[#D4C5B5]/70 text-[9px] tracking-[0.45em] uppercase font-light">Diagnóstico profesional · Protocolos exclusivos</p>
          </div>

          {/* Пространство */}
          <div className="flex-1" />

          {/* Нижняя часть: весь контент прижат влево */}
          <div className="px-6 pb-12">
            <h1 className="font-serif text-4xl font-light tracking-wider text-white mb-4 leading-tight">
              Estudio de salud<br />y belleza capilar
            </h1>
            <div className="w-14 h-px bg-[#D4C5B5]/60 mt-0 mb-6" />
            <p className="text-sm font-light leading-relaxed text-white/65 mb-8 max-w-[320px]">
              Alisado sin dañar, reconstrucción real y brillo espejo desde la primera sesión.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {user ? (
                <Link to="/booking"
                  className="w-full py-4 bg-white text-[#3D3D3D] tracking-[0.18em] font-light text-[13px] uppercase text-center shadow-lg hover:shadow-xl transition-shadow">
                  Reservar Cita
                </Link>
              ) : (
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 bg-white text-[#3D3D3D] tracking-[0.18em] font-light text-[13px] uppercase text-center shadow-lg hover:shadow-xl transition-shadow block">
                  Reservar Cita
                </a>
              )}
              <button onClick={() => scrollTo('servicios')}
                className="w-full py-4 border border-white/60 text-white/90 tracking-[0.18em] font-light text-[12px] uppercase hover:bg-white/10 transition-all">
                Ver Servicios
              </button>
            </div>

            {/* Соцсети */}
            <div className="flex justify-start gap-7">
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
              <a href={YT_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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

        {/* Tagline pinned to very top of screen — desktop */}
        <div className="hidden lg:block absolute z-20 top-4 left-14 xl:left-20 2xl:left-28">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#D4C5B5]/80 font-light">Diagnóstico profesional · Protocolos exclusivos</p>
        </div>

        {/* Десктоп Hero Layout ── */}
        <div className="hidden lg:flex relative z-10 w-full px-14 xl:px-20 2xl:px-28 pb-16 items-end flex-1">
          <div className="max-w-[480px] xl:max-w-[520px]">
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light mb-6 tracking-wide text-white leading-tight">
              Estudio de salud<br />y belleza capilar
            </h1>
            <p className="text-base lg:text-lg font-light mb-10 leading-relaxed text-white/70 max-w-[560px]">
              Alisado sin dañar, reconstrucción real y brillo espejo desde la primera sesión.
            </p>
            <div className="flex gap-5">
              {user ? (
                <Link to="/booking"
                  className="px-10 py-4 bg-white/95 backdrop-blur-sm text-[#3D3D3D] tracking-[0.18em] text-[12px] font-light uppercase hover:bg-white transition-all">
                  RESERVAR CITA
                </Link>
              ) : (
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="px-10 py-4 bg-white/95 backdrop-blur-sm text-[#3D3D3D] tracking-[0.18em] text-[12px] font-light uppercase hover:bg-white transition-all">
                  RESERVAR CITA
                </a>
              )}
              <button onClick={() => scrollTo('servicios')}
                className="px-10 py-4 border border-white/50 text-white tracking-[0.18em] text-[12px] font-light uppercase hover:bg-white/10 transition-all">
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

      {/* ═══ СЕКЦИИ ═══ */}
      <PorQueElegirSection />
      <TratamientosSection />
      <InteractivePricing />
      <AntesDespuesSection />
      <ReviewsSection />
      <HomecareSection />
      <FormacionesSection />
      <BeautyScriptsSection />
      <GoogleMapSection />

      {/* CTA final */}
      <section className="bg-[#3d3530] py-16 lg:py-24">
        <div className="max-w-[900px] mx-auto px-8 text-center">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#B8A99A] mb-6 font-light">Contacto</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-light tracking-wide">Reserva tu cita</h2>
          <p className="text-base md:text-lg lg:text-xl text-[#c0b8b0] mb-10 font-light leading-relaxed">
            Estamos en Madrid, España. Contáctanos para reservar tu tratamiento personalizado.
          </p>
          {user ? (
            <Link to="/booking"
              className="inline-block px-14 py-5 border border-[#B8A99A] text-[#B8A99A] text-[14px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all font-light">
              Reservar Cita
            </Link>
          ) : (
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="inline-block px-14 py-5 border border-[#B8A99A] text-[#B8A99A] text-[14px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all font-light">
              Contactar por WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#2d2520] text-[#9a8f87] py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 md:gap-16 mb-12">
            <div>
              <p className="font-serif text-white text-2xl mb-4 font-light">Keratin Madrid</p>
              <p className="text-lg leading-relaxed font-light">Estudio de salud y belleza capilar. Madrid, España.</p>
            </div>
            <div>
              <p className="text-[12px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-5 font-light">Navegación</p>
                <div className="flex flex-col gap-3 text-lg font-light">
                <button onClick={() => scrollTo('inicio')} className="text-left hover:text-[#B8A99A] transition-colors">Inicio</button>
                <button onClick={() => scrollTo('precios')} className="text-left hover:text-[#B8A99A] transition-colors">Precios</button>
                <button onClick={() => scrollTo('homecare')} className="text-left hover:text-[#B8A99A] transition-colors">Homecare</button>
              </div>
            </div>
            <div>
              <p className="text-[12px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-5 font-light">Para Profesionales</p>
              <div className="flex flex-col gap-3 text-base font-light">
                <button onClick={() => scrollTo('formaciones')} className="text-left hover:text-[#B8A99A] transition-colors">Formaciones</button>
                <button onClick={() => scrollTo('scripts')} className="text-left hover:text-[#B8A99A] transition-colors">Beauty Scripts</button>
              </div>
            </div>
            <div>
              <p className="text-[12px] tracking-[0.2em] uppercase text-[#c0b8b0] mb-5 font-light">Contacto</p>
              <div className="flex flex-col gap-3 text-base font-light">
                <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#B8A99A]">@keratin_madrid</a>
                <a href={YT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#B8A99A]">YouTube</a>
                <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="hover:text-[#B8A99A]">+34 641 26 15 59</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#3d3530] pt-10 text-center text-[13px] text-[#7a7070] font-light">
            © 2025 Keratin Madrid. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
