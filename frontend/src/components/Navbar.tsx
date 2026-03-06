import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAppHooks';
import { logout } from '../store/authSlice';

const WA_URL = 'https://wa.me/34641261559?text=Hola!%20Quiero%20reservar%20una%20cita';
const IG_URL = 'https://www.instagram.com/keratin_madrid';
const TK_URL = 'https://www.tiktok.com/@keratin_madrid';

function TikTokIcon() {
  return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/></svg>);
}

function InstagramIcon() {
  return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>);
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servDrop, setServDrop] = useState(false);
  const [homeDrop, setHomeDrop] = useState(false);
  const [proDrop, setProDrop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'admin';

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

  const toggleServ = () => { setServDrop(!servDrop); setHomeDrop(false); setProDrop(false); };
  const toggleHome = () => { setHomeDrop(!homeDrop); setServDrop(false); setProDrop(false); };
  const togglePro = () => { setProDrop(!proDrop); setServDrop(false); setHomeDrop(false); };

  const lnk = 'text-[13px] tracking-[0.12em] uppercase text-[#3d3530] hover:text-[#8B7355] transition-colors cursor-pointer whitespace-nowrap';

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5] transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          <Link to="/" className="font-serif text-base sm:text-lg tracking-[0.06em] uppercase text-[#3d3530] flex-shrink-0">
            Keratin <span className="font-light">Madrid</span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button onClick={() => scrollTo('inicio')} className={lnk}>Inicio</button>

            {/* Servicios dropdown */}
            <div className="relative">
              <button onClick={toggleServ} className={`${lnk} flex items-center gap-1`}>
                Servicios
                <svg className={`w-3 h-3 transition-transform ${servDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {servDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[180px] py-2 z-50">
                  <button onClick={() => scrollTo('servicios')} className="block w-full text-left px-5 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4]">Tratamientos</button>
                  <button onClick={() => scrollTo('precios')} className="block w-full text-left px-5 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4]">Precios</button>
                  <button onClick={() => scrollTo('resultados')} className="block w-full text-left px-5 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4]">Resultados</button>
                </div>
              )}
            </div>

            {/* Homecare dropdown */}
            <div className="relative">
              <button onClick={toggleHome} className={`${lnk} flex items-center gap-1`}>
                Homecare
                <svg className={`w-3 h-3 transition-transform ${homeDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {homeDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[180px] py-2 z-50">
                  <button onClick={() => scrollTo('homecare')} className="block w-full text-left px-5 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4]">Cuidado en casa</button>
                  <button onClick={() => scrollTo('productos')} className="block w-full text-left px-5 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4]">Productos</button>
                </div>
              )}
            </div>

            {/* Para Profesionales dropdown */}
            <div className="relative">
              <button onClick={togglePro} className={`${lnk} flex items-center gap-1`}>
                Para Profesionales
                <svg className={`w-3 h-3 transition-transform ${proDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {proDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[180px] py-2 z-50">
                  <button onClick={() => scrollTo('formaciones')} className="block w-full text-left px-5 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4]">Formaciones</button>
                  <button onClick={() => scrollTo('scripts')} className="block w-full text-left px-5 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4]">Beauty Scripts</button>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-[#3d3530] hover:text-[#8B7355] p-1"><TikTokIcon/></a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-[#3d3530] hover:text-[#8B7355] p-1"><InstagramIcon/></a>
            <div className="w-px h-4 bg-[#d4cfc9]"/>
            {user ? (
              <>
                {isAdmin && <Link to="/admin" className="text-[11px] tracking-widest uppercase text-white bg-[#8B7355] px-3 py-1.5 hover:bg-[#7a6348]">Admin</Link>}
                <span className="text-[12px] tracking-widest uppercase text-[#8B7355] max-w-[90px] truncate">{user.name}</span>
                <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-[11px] tracking-widest uppercase text-[#a09890] hover:text-[#3d3530]">Salir</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[12px] tracking-[0.12em] uppercase text-[#3d3530] hover:text-[#8B7355]">Entrar</Link>
                <Link to="/register" className="text-[12px] tracking-[0.12em] uppercase text-[#3d3530] hover:text-[#8B7355]">Registrarse</Link>
              </>
            )}
            <div className="w-px h-4 bg-[#d4cfc9]"/>
            {user
              ? <Link to="/booking" className="px-5 py-2.5 bg-[#B8A99A] text-white text-[11px] tracking-[0.15em] uppercase hover:bg-[#9A8B7A] whitespace-nowrap">Reservar Cita</Link>
              : <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#B8A99A] text-white text-[11px] tracking-[0.15em] uppercase hover:bg-[#9A8B7A] whitespace-nowrap">Reservar Cita</a>
            }
          </div>

          {/* MOBILE HEADER */}
          <div className="flex items-center gap-2 lg:hidden">
            <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-[#3d3530]"><TikTokIcon/></a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-[#3d3530]"><InstagramIcon/></a>
            <div className="w-px h-4 bg-[#d4cfc9]"/>
            {user
              ? <span className="text-[11px] tracking-widest uppercase text-[#8B7355] truncate max-w-[60px]">{user.name}</span>
              : <div className="flex items-center gap-1">
                  <Link to="/login" className="text-[11px] tracking-[0.08em] uppercase text-[#3d3530] whitespace-nowrap">Entrar</Link>
                  <span className="text-[#d4cfc9]">·</span>
                  <Link to="/register" className="text-[11px] tracking-[0.08em] uppercase text-[#3d3530] whitespace-nowrap">Registro</Link>
                </div>
            }
            <button onClick={() => setMobileOpen(!mobileOpen)} className="flex flex-col justify-center w-7 h-7 gap-[5px] ml-1" aria-label="Menu">
              <span className={`block w-5 h-px bg-[#3d3530] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`}/>
              <span className={`block w-5 h-px bg-[#3d3530] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-5 h-px bg-[#3d3530] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}/>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`lg:hidden bg-[#FAF8F5] border-t border-[#e8e2da] overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-5 flex flex-col gap-0.5">
          <button onClick={() => scrollTo('inicio')} className="text-left text-[14px] tracking-[0.12em] uppercase text-[#3d3530] py-3 border-b border-[#f5f0eb]">Inicio</button>

          <div className="py-3 border-b border-[#f5f0eb]">
            <p className="text-[14px] tracking-[0.12em] uppercase text-[#3d3530] mb-2">Servicios</p>
            <div className="pl-4 flex flex-col gap-2.5">
              <button onClick={() => scrollTo('servicios')} className="text-left text-[13px] tracking-widest uppercase text-[#8B7355]">Tratamientos</button>
              <button onClick={() => scrollTo('precios')} className="text-left text-[13px] tracking-widest uppercase text-[#8B7355]">Precios</button>
              <button onClick={() => scrollTo('resultados')} className="text-left text-[13px] tracking-widest uppercase text-[#8B7355]">Resultados</button>
            </div>
          </div>

          <div className="py-3 border-b border-[#f5f0eb]">
            <p className="text-[14px] tracking-[0.12em] uppercase text-[#3d3530] mb-2">Homecare</p>
            <div className="pl-4 flex flex-col gap-2.5">
              <button onClick={() => scrollTo('homecare')} className="text-left text-[13px] tracking-widest uppercase text-[#8B7355]">Cuidado en casa</button>
              <button onClick={() => scrollTo('productos')} className="text-left text-[13px] tracking-widest uppercase text-[#8B7355]">Productos</button>
            </div>
          </div>

          <div className="py-3 border-b border-[#f5f0eb]">
            <p className="text-[14px] tracking-[0.12em] uppercase text-[#3d3530] mb-2">Para Profesionales</p>
            <div className="pl-4 flex flex-col gap-2.5">
              <button onClick={() => scrollTo('formaciones')} className="text-left text-[13px] tracking-widest uppercase text-[#8B7355]">Formaciones</button>
              <button onClick={() => scrollTo('scripts')} className="text-left text-[13px] tracking-widest uppercase text-[#8B7355]">Beauty Scripts</button>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                {isAdmin && <Link to="/admin" className="self-start text-[13px] tracking-widest uppercase text-white bg-[#8B7355] px-4 py-2">Panel Admin</Link>}
                <Link to="/booking" className="text-center py-3.5 bg-[#B8A99A] text-white text-[12px] tracking-widest uppercase block">Reservar Cita</Link>
                <button onClick={() => { dispatch(logout()); navigate('/'); setMobileOpen(false); }} className="text-left text-[12px] tracking-widest uppercase text-[#a09890]">Cerrar sesion</button>
              </>
            ) : (
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-center py-3.5 bg-[#B8A99A] text-white text-[12px] tracking-widest uppercase block">Reservar Cita</a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
