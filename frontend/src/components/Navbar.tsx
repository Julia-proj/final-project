import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAppHooks';
import { logout } from '../store/authSlice';

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

  // Скролл → тень
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Клик вне navbar → закрыть все dropdown'ы
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

  // При смене страницы → закрыть всё
  useEffect(() => {
    setMobileOpen(false);
    setServDrop(false);
    setHomeDrop(false);
    setProDrop(false);
  }, [location]);

  // Плавный скролл
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

  // Переключатель dropdown'а (закрывает другие)
  const toggleServ = () => { setServDrop(!servDrop); setHomeDrop(false); setProDrop(false); };
  const toggleHome = () => { setHomeDrop(!homeDrop); setServDrop(false); setProDrop(false); };
  const togglePro = () => { setProDrop(!proDrop); setServDrop(false); setHomeDrop(false); };

  const lnk = 'text-[13px] tracking-[0.12em] uppercase text-[#3d3530] hover:text-[#8B7355] transition-colors cursor-pointer whitespace-nowrap font-light';

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/88 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-md border-b border-[#e8e2da]' : 'border-b border-[#ede8e2]/60'}`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-14">
<div className="flex items-center justify-between h-[58px] lg:h-[64px]">

          <Link to="/" className="font-serif text-[17px] sm:text-[19px] lg:text-[21px] tracking-[0.08em] uppercase text-[#3d3530] flex-shrink-0">
            Keratin <span className="font-light">Madrid</span>
          </Link>

          {/* ═══ DESKTOP LINKS ═══ */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            <button onClick={() => scrollTo('inicio')} className={lnk}>Inicio</button>

            {/* --- Servicios (dropdown по КЛИКУ) --- */}
            <div className="relative">
              <button onClick={toggleServ} className={`${lnk} flex items-center gap-1`}>
                Servicios
                <svg className={`w-3 h-3 transition-transform ${servDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {servDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[220px] py-2 z-50">
                  <button onClick={() => scrollTo('servicios')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">Tratamientos</button>
                  <button onClick={() => scrollTo('precios')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">Precios</button>
                  <button onClick={() => scrollTo('resultados')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">Resultados</button>
                </div>
              )}
            </div>

            {/* --- Homecare (dropdown по КЛИКУ) --- */}
            <div className="relative">
              <button onClick={toggleHome} className={`${lnk} flex items-center gap-1`}>
                Homecare
                <svg className={`w-3 h-3 transition-transform ${homeDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {homeDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[220px] py-2 z-50">
                  <button onClick={() => scrollTo('homecare')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">Cuidado en casa</button>
                  <button onClick={() => scrollTo('productos')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">Productos</button>
                </div>
              )}
            </div>

            {/* --- Para Profesionales (dropdown по КЛИКУ) --- */}
            <div className="relative">
              <button onClick={togglePro} className={`${lnk} flex items-center gap-1`}>
                Para Profesionales
                <svg className={`w-3 h-3 transition-transform ${proDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {proDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#FAF8F5] border border-[#e8e2da] shadow-lg min-w-[220px] py-2 z-50">
                  <button onClick={() => scrollTo('formaciones')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">Formaciones</button>
                  <button onClick={() => scrollTo('scripts')} className="block w-full text-left px-7 py-3 text-[12px] tracking-[0.1em] uppercase text-[#3d3530] hover:bg-[#f0ebe4] font-light">Beauty Scripts</button>
                </div>
              )}
            </div>
          </div>

          {/* ═══ DESKTOP ACTIONS ═══ */}
          <div className="hidden lg:flex items-center gap-4">
            <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] hover:text-[#8B7355] p-2"><TikTokIcon/></a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] hover:text-[#8B7355] p-2"><InstagramIcon/></a>
            <a href={YT_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] hover:text-[#8B7355] p-2"><YouTubeIcon/></a>
            <div className="w-px h-5 bg-[#d4cfc9]"/>
            {user ? (
              <>
                {isAdmin && <Link to="/admin" className="text-[12px] tracking-widest uppercase text-white bg-[#8B7355] px-3 py-1.5 hover:bg-[#7a6348]">Admin</Link>}
                <span className="text-[13px] tracking-widest uppercase text-[#8B7355] max-w-[90px] truncate">{user.name}</span>
                <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-[12px] tracking-widest uppercase text-[#a09890] hover:text-[#3d3530]">Salir</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[12px] tracking-[0.1em] uppercase text-[#8B7355] hover:text-[#3d3530] font-light transition-colors">Entrar</Link>
                <Link to="/register" className="text-[11px] tracking-[0.1em] uppercase border border-[#B8A99A] text-[#B8A99A] hover:bg-[#B8A99A] hover:text-white px-3.5 py-1.5 font-light transition-all whitespace-nowrap">Registrarse</Link>
              </>
            )}
          </div>

          {/* ═══ MOBILE HEADER ═══ */}
          <div className="flex items-center gap-3 lg:hidden">
            <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] p-1"><TikTokIcon/></a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] p-1"><InstagramIcon/></a>
            <a href={YT_URL} target="_blank" rel="noopener noreferrer" className="text-[#a89585] p-1"><YouTubeIcon/></a>
            <div className="w-px h-5 bg-[#d4cfc9]"/>
            {user
              ? <span className="text-[12px] tracking-widest uppercase text-[#8B7355] truncate max-w-[70px]">{user.name}</span>
              : <div className="flex items-center gap-1.5">
                  <Link to="/login" className="text-[12px] tracking-[0.08em] uppercase text-[#3d3530] whitespace-nowrap">Entrar</Link>
                  <span className="text-[#d4cfc9]">·</span>
                  <Link to="/register" className="text-[12px] tracking-[0.08em] uppercase text-[#3d3530] whitespace-nowrap">Registro</Link>
                </div>
            }
            <button onClick={() => setMobileOpen(!mobileOpen)} className="flex flex-col justify-center w-8 h-8 gap-[6px] ml-1" aria-label="Menú">
              <span className={`block w-6 h-[1.5px] bg-[#3d3530] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`}/>
              <span className={`block w-6 h-[1.5px] bg-[#3d3530] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-6 h-[1.5px] bg-[#3d3530] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`}/>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE MENU ═══ */}
      <div className={`lg:hidden bg-[#FAF8F5] border-t border-[#e8e2da] overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-7 py-6 flex flex-col gap-0.5">
          <button onClick={() => scrollTo('inicio')} className="text-left text-[15px] tracking-[0.1em] uppercase text-[#3d3530] py-3.5 border-b border-[#f5f0eb] font-light">Inicio</button>

          <div className="py-3.5 border-b border-[#f5f0eb]">
            <p className="text-[15px] tracking-[0.1em] uppercase text-[#3d3530] mb-2.5 font-light">Servicios</p>
            <div className="pl-5 flex flex-col gap-3">
              <button onClick={() => scrollTo('servicios')} className="text-left text-[14px] tracking-widest uppercase text-[#8B7355] font-light">Tratamientos</button>
              <button onClick={() => scrollTo('precios')} className="text-left text-[14px] tracking-widest uppercase text-[#8B7355] font-light">Precios</button>
              <button onClick={() => scrollTo('resultados')} className="text-left text-[14px] tracking-widest uppercase text-[#8B7355] font-light">Resultados</button>
            </div>
          </div>

          <div className="py-3.5 border-b border-[#f5f0eb]">
            <p className="text-[15px] tracking-[0.1em] uppercase text-[#3d3530] mb-2.5 font-light">Homecare</p>
            <div className="pl-5 flex flex-col gap-3">
              <button onClick={() => scrollTo('homecare')} className="text-left text-[14px] tracking-widest uppercase text-[#8B7355] font-light">Cuidado en casa</button>
              <button onClick={() => scrollTo('productos')} className="text-left text-[14px] tracking-widest uppercase text-[#8B7355] font-light">Productos</button>
            </div>
          </div>

          <div className="py-3.5 border-b border-[#f5f0eb]">
            <p className="text-[15px] tracking-[0.1em] uppercase text-[#3d3530] mb-2.5 font-light">Para Profesionales</p>
            <div className="pl-5 flex flex-col gap-3">
              <button onClick={() => scrollTo('formaciones')} className="text-left text-[14px] tracking-widest uppercase text-[#8B7355] font-light">Formaciones</button>
              <button onClick={() => scrollTo('scripts')} className="text-left text-[14px] tracking-widest uppercase text-[#8B7355] font-light">Beauty Scripts</button>
            </div>
          </div>

          {user && (
            <div className="pt-5 flex flex-col gap-3">
              {isAdmin && <Link to="/admin" className="self-start text-[13px] tracking-widest uppercase text-white bg-[#8B7355] px-5 py-2.5">Panel Admin</Link>}
              <button onClick={() => { dispatch(logout()); navigate('/'); setMobileOpen(false); }} className="text-left text-[13px] tracking-widest uppercase text-[#a09890] font-light">Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
