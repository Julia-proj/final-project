// ============================================================
// components/Navbar.tsx — Barra de navegación principal
// ============================================================

import { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAppHooks';
import { logout } from '../store/authSlice';
import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';

const IG_URL = 'https://www.instagram.com/keratin_madrid';
const TK_URL = 'https://www.tiktok.com/@keratin_madrid';
const YT_URL = 'https://www.youtube.com/@Aleksandrova_el';

function TikTokIcon() {
  return (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/></svg>);
}

function InstagramIcon() {
  return (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>);
}

function YouTubeIcon() {
  return (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>);
}

const LANGS: Lang[] = ['es', 'ru', 'en'];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servDrop, setServDrop] = useState(false);
  const [homeDrop, setHomeDrop] = useState(false);
  const [proDrop, setProDrop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'admin';
  const { lang, setLang, tr } = useLanguage();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setServDrop(false);
        setHomeDrop(false);
        setProDrop(false);
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServDrop(false);
    setHomeDrop(false);
    setProDrop(false);
    setLangOpen(false);
  }, [location]);

  const scrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 350);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
    setServDrop(false);
    setHomeDrop(false);
    setProDrop(false);
  };

  const toggleServ = () => { setServDrop(!servDrop); setHomeDrop(false); setProDrop(false); setLangOpen(false); };
  const toggleHome = () => { setHomeDrop(!homeDrop); setServDrop(false); setProDrop(false); setLangOpen(false); };
  const togglePro = () => { setProDrop(!proDrop); setServDrop(false); setHomeDrop(false); setLangOpen(false); };

  const lnk = 'text-[13px] tracking-[0.12em] uppercase text-[#3d3530] hover:text-[#8B7355] transition-colors cursor-pointer whitespace-nowrap font-normal';

  // Language selector — minimal ES · RU · EN pill
  const LangSelector = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex items-center ${mobile ? 'gap-0 text-[10px]' : 'gap-0.5 text-[11px]'} tracking-[0.14em]`}>
      {LANGS.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span className={`select-none ${mobile ? 'text-[#ddd6d0]' : 'mx-0.5 text-[#d4cfc9]'}`}>·</span>}
          <button
            onClick={() => setLang(l)}
            className={`${mobile ? 'px-0.5' : 'px-1'} py-0.5 transition-colors ${
              lang === l
                ? mobile
                  ? 'text-[#8B7355] font-medium'
                  : 'text-[#3d3530] font-semibold'
                : mobile
                  ? 'text-[#c4bab4] hover:text-[#8B7355]'
                  : 'text-[#a89585] hover:text-[#8B7355]'
            }`}
          >
            {l.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  );

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 bg-[#F9F8F6]/92 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-md border-b border-[#e8e2da]' : 'border-b border-[#ede8e2]/60'}`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between h-[58px] lg:h-[64px]">

          <Link to="/" className="font-serif text-[17px] sm:text-[19px] lg:text-[21px] tracking-[0.08em] uppercase text-[#3d3530] flex-shrink-0">
            Keratin <span className="font-normal">Madrid</span>
          </Link>

          {/* ═══ DESKTOP LINKS ═══ */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            <button onClick={() => scrollTo('inicio')} className={lnk}>{tr.nav.inicio}</button>

            {/* Servicios */}
            <div className="relative">
              <button onClick={toggleServ} className={`${lnk} flex items-center gap-1`}>
                {tr.nav.servicios}
                <svg className={`w-3 h-3 transition-transform ${servDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {servDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[220px] py-2 z-50">
                  <button onClick={() => scrollTo('servicios')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">{tr.nav.tratamientos}</button>
                  <button onClick={() => scrollTo('precios')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">{tr.nav.precios}</button>
                  <button onClick={() => scrollTo('resultados')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">{tr.nav.resultados}</button>
                </div>
              )}
            </div>

            {/* Homecare */}
            <div className="relative">
              <button onClick={toggleHome} className={`${lnk} flex items-center gap-1`}>
                {tr.nav.homecare}
                <svg className={`w-3 h-3 transition-transform ${homeDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {homeDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[220px] py-2 z-50">
                  <button onClick={() => scrollTo('homecare')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">{tr.nav.cuidado}</button>
                  <button onClick={() => scrollTo('productos')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">{tr.nav.productos}</button>
                </div>
              )}
            </div>

            {/* Para Profesionales */}
            <div className="relative">
              <button onClick={togglePro} className={`${lnk} flex items-center gap-1`}>
                {tr.nav.profesionales}
                <svg className={`w-3 h-3 transition-transform ${proDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {proDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[220px] py-2 z-50">
                  <button onClick={() => scrollTo('formaciones')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">{tr.nav.formaciones}</button>
                  <button onClick={() => scrollTo('scripts')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">Beauty Scripts</button>
                </div>
              )}
            </div>
          </div>

          {/* ═══ DESKTOP ACTIONS ═══ */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] hover:text-[#8B7355] p-1.5"><TikTokIcon/></a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] hover:text-[#8B7355] p-1.5"><InstagramIcon/></a>
            <a href={YT_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] hover:text-[#8B7355] p-1.5"><YouTubeIcon/></a>
            <div className="w-px h-5 bg-[#d4cfc9]"/>
            {/* ── Language dropdown ── */}
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setServDrop(false); setHomeDrop(false); setProDrop(false); }}
                className="flex items-center gap-1 text-[11px] tracking-[0.16em] uppercase text-[#8B7355] hover:text-[#3d3530] transition-colors px-1 py-0.5"
              >
                {lang.toUpperCase()}
                <svg className={`w-2.5 h-2.5 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#FAF8F5] border border-[#e8e2da] shadow-md z-50 min-w-[52px]">
                  {LANGS.filter(l => l !== lang).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className="block w-full py-2.5 text-[10px] tracking-[0.16em] uppercase text-[#8B7355] hover:bg-[#f0ebe4] transition-colors text-center font-normal"
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-5 bg-[#d4cfc9]"/>
            {user ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" className="text-[12px] tracking-widest uppercase text-white bg-[#8B7355] px-3 py-1.5 hover:bg-[#7a6348]">{tr.nav.panel}</Link>
                ) : (
                  <Link to="/dashboard" className="text-[13px] tracking-widest uppercase text-[#8B7355] hover:text-[#3d3530] max-w-[100px] truncate">{user.name}</Link>
                )}
                <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-[12px] tracking-widest uppercase text-[#a09890] hover:text-[#3d3530]">{tr.nav.salir}</button>
              </>
            ) : (
              <Link to="/login" className="text-[11px] tracking-[0.1em] uppercase border border-[#B8A99A] text-[#B8A99A] hover:bg-[#B8A99A] hover:text-white px-3.5 py-1.5 font-medium transition-all whitespace-nowrap">{tr.nav.miCuenta}</Link>
            )}
          </div>

          {/* ═══ MOBILE HEADER ═══ */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {/* Mobile language dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-[3px] px-1.5 py-1 text-[10px] tracking-[0.16em] uppercase text-[#8B7355] hover:text-[#3d3530] transition-colors"
              >
                {lang.toUpperCase()}
                <svg className={`w-[9px] h-[9px] transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-[#FAF8F5] border border-[#e8e2da] shadow-md z-50 min-w-[46px]">
                  {LANGS.filter(l => l !== lang).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className="block w-full py-2.5 text-[10px] tracking-[0.16em] uppercase text-[#8B7355] hover:bg-[#f0ebe4] transition-colors text-center font-normal"
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user && (
              <span className="text-[11px] tracking-[0.15em] uppercase text-[#8B7355] truncate max-w-[72px]">{user.name}</span>
            )}
            <button onClick={() => { setMobileOpen(!mobileOpen); setLangOpen(false); }} className="flex flex-col justify-center w-8 h-8 gap-[6px]" aria-label="Menú">
              <span className={`block w-6 h-[1.5px] bg-[#3d3530] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`}/>
              <span className={`block w-6 h-[1.5px] bg-[#3d3530] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-6 h-[1.5px] bg-[#3d3530] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`}/>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE MENU ═══ */}
      <div className={`lg:hidden bg-[#F9F8F6] border-t border-[#e8e2da] overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[92vh] overflow-y-auto opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-5 flex flex-col">

          <button onClick={() => scrollTo('inicio')} className="text-left py-4 border-b border-[#f0ebe4] text-[12px] tracking-[0.22em] uppercase text-[#3d3530] font-normal">
            {tr.nav.inicio}
          </button>

          <div className="border-b border-[#f0ebe4]">
            <p className="py-4 text-[12px] tracking-[0.22em] uppercase text-[#3d3530] font-normal">{tr.nav.servicios}</p>
            <div className="mb-4 pl-4 border-l border-[#e0d9d1] flex flex-col gap-3.5">
              <button onClick={() => scrollTo('servicios')} className="text-left text-[11px] tracking-[0.2em] uppercase text-[#8B7355] font-normal">{tr.nav.tratamientos}</button>
              <button onClick={() => scrollTo('precios')} className="text-left text-[11px] tracking-[0.2em] uppercase text-[#8B7355] font-normal">{tr.nav.precios}</button>
              <button onClick={() => scrollTo('resultados')} className="text-left text-[11px] tracking-[0.2em] uppercase text-[#8B7355] font-normal">{tr.nav.resultados}</button>
            </div>
          </div>

          <div className="border-b border-[#f0ebe4]">
            <p className="py-4 text-[12px] tracking-[0.22em] uppercase text-[#3d3530] font-normal">{tr.nav.homecare}</p>
            <div className="mb-4 pl-4 border-l border-[#e0d9d1] flex flex-col gap-3.5">
              <button onClick={() => scrollTo('homecare')} className="text-left text-[11px] tracking-[0.2em] uppercase text-[#8B7355] font-normal">{tr.nav.cuidado}</button>
              <button onClick={() => scrollTo('productos')} className="text-left text-[11px] tracking-[0.2em] uppercase text-[#8B7355] font-normal">{tr.nav.productos}</button>
            </div>
          </div>

          <div className="border-b border-[#f0ebe4]">
            <p className="py-4 text-[12px] tracking-[0.22em] uppercase text-[#3d3530] font-normal">{tr.nav.profesionales}</p>
            <div className="mb-4 pl-4 border-l border-[#e0d9d1] flex flex-col gap-3.5">
              <button onClick={() => scrollTo('formaciones')} className="text-left text-[11px] tracking-[0.2em] uppercase text-[#8B7355] font-normal">{tr.nav.formaciones}</button>
              <button onClick={() => scrollTo('scripts')} className="text-left text-[11px] tracking-[0.2em] uppercase text-[#8B7355] font-normal">Beauty Scripts</button>
            </div>
          </div>

          {/* Auth */}
          {user ? (
            <div className="pt-5 pb-1 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B8A99A] flex-shrink-0"/>
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#8B7355] font-normal truncate">{user.name}</span>
              </div>
              {isAdmin ? (
                <Link to="/admin" onClick={() => setMobileOpen(false)}
                  className="self-start text-[11px] tracking-[0.2em] uppercase text-white bg-[#8B7355] px-6 py-2.5 font-medium hover:bg-[#7a6348] transition-colors">
                  {tr.nav.panelAdmin}
                </Link>
              ) : (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className="self-start text-[11px] tracking-[0.2em] uppercase text-[#3d3530] border border-[#e8e2da] px-6 py-2.5 font-medium hover:bg-[#f0ebe4] transition-colors">
                  {tr.nav.miCuenta}
                </Link>
              )}
              <button onClick={() => { dispatch(logout()); navigate('/'); setMobileOpen(false); }}
                className="self-start text-[11px] tracking-[0.2em] uppercase text-[#a09890] font-normal hover:text-[#3d3530] transition-colors">
                {tr.nav.cerrarSesion}
              </button>
            </div>
          ) : (
            <div className="pt-5 pb-1 flex flex-col gap-2.5">
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 text-center text-[12px] tracking-[0.22em] uppercase bg-[#3d3530] text-white font-medium hover:bg-[#2d2520] transition-colors">
                {tr.nav.entrar}
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 text-center text-[12px] tracking-[0.22em] uppercase border border-[#B8A99A] text-[#B8A99A] font-medium hover:bg-[#B8A99A] hover:text-white transition-all">
                {tr.nav.registrarse}
              </Link>
            </div>
          )}

          {/* Social */}
          <div className="flex items-center justify-end pt-5 mt-3 border-t border-[#f0ebe4]">
            <div className="flex items-center gap-5">
              <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-[#b5aca4] hover:text-[#8B7355] transition-colors"><TikTokIcon/></a>
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-[#b5aca4] hover:text-[#8B7355] transition-colors"><InstagramIcon/></a>
              <a href={YT_URL} target="_blank" rel="noopener noreferrer" className="text-[#b5aca4] hover:text-[#8B7355] transition-colors"><YouTubeIcon/></a>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
