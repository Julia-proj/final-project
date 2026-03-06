import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAppHooks';
import { logout } from '../store/authSlice';

const WA_URL = 'https://wa.me/34641261559?text=Hola!%20Quiero%20reservar%20una%20cita';
const IG_URL = 'https://www.instagram.com/keratin_madrid';
const TK_URL = 'https://www.tiktok.com/@keratin_madrid';

function TikTokIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
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

  const linkClass = 'text-[12px] tracking-[0.14em] uppercase text-[#2D2A26] hover:text-[#C4A484] transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium';

  return (
    <nav 
      ref={navRef} 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#FAF8F6]/97 backdrop-blur-md shadow-sm' 
          : 'bg-[#FAF8F6]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="font-serif text-lg tracking-[0.08em] text-[#2D2A26] group-hover:text-[#C4A484] transition-colors">
              Keratin <span className="font-light">Madrid</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-9">
            <button onClick={() => scrollTo('inicio')} className={linkClass}>Inicio</button>

            {/* Servicios Dropdown */}
            <div className="relative">
              <button onClick={toggleServ} className={`${linkClass} flex items-center gap-1.5`}>
                Servicios
                <svg className={`w-3 h-3 transition-transform duration-200 ${servDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {servDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-[#E8E4DF] shadow-lg min-w-[200px] py-2">
                  <button onClick={() => scrollTo('servicios')} className="block w-full text-left px-5 py-3 text-[11px] tracking-[0.12em] uppercase text-[#2D2A26] hover:bg-[#F5F1EC] hover:text-[#C4A484] transition-colors">Tratamientos</button>
                  <button onClick={() => scrollTo('precios')} className="block w-full text-left px-5 py-3 text-[11px] tracking-[0.12em] uppercase text-[#2D2A26] hover:bg-[#F5F1EC] hover:text-[#C4A484] transition-colors">Precios</button>
                  <button onClick={() => scrollTo('resultados')} className="block w-full text-left px-5 py-3 text-[11px] tracking-[0.12em] uppercase text-[#2D2A26] hover:bg-[#F5F1EC] hover:text-[#C4A484] transition-colors">Resultados</button>
                </div>
              )}
            </div>

            {/* Homecare Dropdown */}
            <div className="relative">
              <button onClick={toggleHome} className={`${linkClass} flex items-center gap-1.5`}>
                Homecare
                <svg className={`w-3 h-3 transition-transform duration-200 ${homeDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {homeDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-[#E8E4DF] shadow-lg min-w-[200px] py-2">
                  <button onClick={() => scrollTo('homecare')} className="block w-full text-left px-5 py-3 text-[11px] tracking-[0.12em] uppercase text-[#2D2A26] hover:bg-[#F5F1EC] hover:text-[#C4A484] transition-colors">Cuidado en casa</button>
                  <button onClick={() => scrollTo('productos')} className="block w-full text-left px-5 py-3 text-[11px] tracking-[0.12em] uppercase text-[#2D2A26] hover:bg-[#F5F1EC] hover:text-[#C4A484] transition-colors">Productos</button>
                </div>
              )}
            </div>

            {/* Profesionales Dropdown */}
            <div className="relative">
              <button onClick={togglePro} className={`${linkClass} flex items-center gap-1.5`}>
                Profesionales
                <svg className={`w-3 h-3 transition-transform duration-200 ${proDrop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {proDrop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-[#E8E4DF] shadow-lg min-w-[200px] py-2">
                  <button onClick={() => scrollTo('formaciones')} className="block w-full text-left px-5 py-3 text-[11px] tracking-[0.12em] uppercase text-[#2D2A26] hover:bg-[#F5F1EC] hover:text-[#C4A484] transition-colors">Formaciones</button>
                  <button onClick={() => scrollTo('scripts')} className="block w-full text-left px-5 py-3 text-[11px] tracking-[0.12em] uppercase text-[#2D2A26] hover:bg-[#F5F1EC] hover:text-[#C4A484] transition-colors">Beauty Scripts</button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-[#6B635A] hover:text-[#C4A484] transition-colors p-1.5">
                <TikTokIcon/>
              </a>
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-[#6B635A] hover:text-[#C4A484] transition-colors p-1.5">
                <InstagramIcon/>
              </a>
            </div>
            
            <div className="w-px h-5 bg-[#E8E4DF]"/>
            
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link to="/admin" className="text-[10px] tracking-[0.12em] uppercase text-white bg-[#8B7355] px-3 py-1.5 hover:bg-[#6B635A] transition-colors">
                    Admin
                  </Link>
                )}
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#6B635A] max-w-[80px] truncate">{user.name}</span>
                <button 
                  onClick={() => { dispatch(logout()); navigate('/'); }} 
                  className="text-[10px] tracking-[0.1em] uppercase text-[#9A938A] hover:text-[#2D2A26] transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-[11px] tracking-[0.12em] uppercase text-[#6B635A] hover:text-[#C4A484] transition-colors">
                  Entrar
                </Link>
                <Link to="/register" className="text-[11px] tracking-[0.12em] uppercase text-[#6B635A] hover:text-[#C4A484] transition-colors">
                  Registro
                </Link>
              </div>
            )}
            
            <div className="w-px h-5 bg-[#E8E4DF]"/>
            
            {user ? (
              <Link 
                to="/booking" 
                className="px-5 py-2.5 bg-[#C4A484] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors whitespace-nowrap"
              >
                Reservar Cita
              </Link>
            ) : (
              <a 
                href={WA_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2.5 bg-[#C4A484] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#8B7355] transition-colors whitespace-nowrap"
              >
                Reservar Cita
              </a>
            )}
          </div>

          {/* Mobile Header */}
          <div className="flex items-center gap-3 lg:hidden">
            <a href={TK_URL} target="_blank" rel="noopener noreferrer" className="text-[#6B635A]">
              <TikTokIcon/>
            </a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="text-[#6B635A]">
              <InstagramIcon/>
            </a>
            <div className="w-px h-4 bg-[#E8E4DF]"/>
            {user ? (
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#6B635A] truncate max-w-[50px]">{user.name}</span>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/login" className="text-[10px] tracking-[0.08em] uppercase text-[#6B635A] whitespace-nowrap">Entrar</Link>
                <span className="text-[#E8E4DF]">/</span>
                <Link to="/register" className="text-[10px] tracking-[0.08em] uppercase text-[#6B635A] whitespace-nowrap">Registro</Link>
              </div>
            )}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="flex flex-col justify-center w-8 h-8 gap-[5px] ml-1" 
              aria-label="Menu"
            >
              <span className={`block w-5 h-[1.5px] bg-[#2D2A26] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}/>
              <span className={`block w-5 h-[1.5px] bg-[#2D2A26] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-5 h-[1.5px] bg-[#2D2A26] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}/>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white border-t border-[#E8E4DF] overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-1">
          <button onClick={() => scrollTo('inicio')} className="text-left text-[13px] tracking-[0.12em] uppercase text-[#2D2A26] py-3.5 border-b border-[#F5F1EC]">
            Inicio
          </button>

          <div className="py-3.5 border-b border-[#F5F1EC]">
            <p className="text-[13px] tracking-[0.12em] uppercase text-[#2D2A26] mb-3">Servicios</p>
            <div className="pl-4 flex flex-col gap-3">
              <button onClick={() => scrollTo('servicios')} className="text-left text-[12px] tracking-[0.1em] uppercase text-[#C4A484]">Tratamientos</button>
              <button onClick={() => scrollTo('precios')} className="text-left text-[12px] tracking-[0.1em] uppercase text-[#C4A484]">Precios</button>
              <button onClick={() => scrollTo('resultados')} className="text-left text-[12px] tracking-[0.1em] uppercase text-[#C4A484]">Resultados</button>
            </div>
          </div>

          <div className="py-3.5 border-b border-[#F5F1EC]">
            <p className="text-[13px] tracking-[0.12em] uppercase text-[#2D2A26] mb-3">Homecare</p>
            <div className="pl-4 flex flex-col gap-3">
              <button onClick={() => scrollTo('homecare')} className="text-left text-[12px] tracking-[0.1em] uppercase text-[#C4A484]">Cuidado en casa</button>
              <button onClick={() => scrollTo('productos')} className="text-left text-[12px] tracking-[0.1em] uppercase text-[#C4A484]">Productos</button>
            </div>
          </div>

          <div className="py-3.5 border-b border-[#F5F1EC]">
            <p className="text-[13px] tracking-[0.12em] uppercase text-[#2D2A26] mb-3">Profesionales</p>
            <div className="pl-4 flex flex-col gap-3">
              <button onClick={() => scrollTo('formaciones')} className="text-left text-[12px] tracking-[0.1em] uppercase text-[#C4A484]">Formaciones</button>
              <button onClick={() => scrollTo('scripts')} className="text-left text-[12px] tracking-[0.1em] uppercase text-[#C4A484]">Beauty Scripts</button>
            </div>
          </div>

          <div className="pt-5 flex flex-col gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="self-start text-[12px] tracking-[0.1em] uppercase text-white bg-[#8B7355] px-4 py-2">
                    Panel Admin
                  </Link>
                )}
                <Link to="/booking" className="text-center py-3.5 bg-[#C4A484] text-white text-[11px] tracking-[0.15em] uppercase block">
                  Reservar Cita
                </Link>
                <button 
                  onClick={() => { dispatch(logout()); navigate('/'); setMobileOpen(false); }} 
                  className="text-left text-[11px] tracking-[0.1em] uppercase text-[#9A938A]"
                >
                  Cerrar sesion
                </button>
              </>
            ) : (
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-center py-3.5 bg-[#C4A484] text-white text-[11px] tracking-[0.15em] uppercase block">
                Reservar Cita
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
