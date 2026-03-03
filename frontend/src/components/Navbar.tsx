import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAppHooks';
import { logout } from '../store/authSlice';

const NAV_SECTIONS = [
  { label: 'Servicios',     hash: 'servicios' },
  { label: 'Precios',       hash: 'precios' },
  { label: 'Homecare',      hash: 'homecare' },
  { label: 'Profesionales', hash: 'profesionales' },
  { label: 'Resultados',    hash: 'resultados' },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
      navigate(`/#${id}`, { replace: true });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F6]/90 backdrop-blur-md border-b border-[#E8E4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* LOGO */}
          <Link to="/" className="font-serif text-xl text-[#3D3D3D] tracking-widest uppercase">
            Keratin Madrid
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_SECTIONS.map((s) => (
              <button
                key={s.hash}
                onClick={() => scrollToSection(s.hash)}
                className="text-sm text-[#666] hover:text-[#3D3D3D] tracking-wider uppercase transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-[#666]">{user.name}</span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm text-[#B8A99A] hover:text-[#9A8B7A]">Admin</Link>
                )}
                <Link to="/booking" className="px-4 py-2 bg-[#B8A99A] text-white text-sm tracking-wider uppercase hover:bg-[#9A8B7A] transition-colors">
                  Reservar
                </Link>
                <button onClick={() => dispatch(logout())} className="text-sm text-[#999] hover:text-[#666]">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-[#666] hover:text-[#3D3D3D]">Entrar</Link>
                <Link to="/register" className="px-4 py-2 bg-[#B8A99A] text-white text-sm tracking-wider uppercase hover:bg-[#9A8B7A] transition-colors">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* HAMBURGER (mobile) */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span className={`block w-6 h-0.5 bg-[#3D3D3D] transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#3D3D3D] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#3D3D3D] transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAF8F6] border-t border-[#E8E4E0] px-4 pb-6 pt-4">
          <div className="flex flex-col gap-4 mb-6">
            {NAV_SECTIONS.map((s) => (
              <button key={s.hash} onClick={() => scrollToSection(s.hash)}
                className="text-left text-sm text-[#666] tracking-wider uppercase">{s.label}</button>
            ))}
          </div>
          <div className="h-px bg-[#E8E4E0] mb-4" />
          {user ? (
            <div className="flex flex-col gap-3">
              <span className="text-sm text-[#999]">{user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-[#B8A99A]">Panel Admin</Link>
              )}
              <Link to="/booking" onClick={() => setMenuOpen(false)}
                className="text-center py-3 bg-[#B8A99A] text-white text-sm tracking-wider uppercase">
                Reservar Cita
              </Link>
              <button onClick={() => { dispatch(logout()); setMenuOpen(false); }} className="text-sm text-[#999] text-left">
                Salir
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="text-center py-3 border border-[#B8A99A] text-[#B8A99A] text-sm tracking-wider uppercase">
                Entrar
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="text-center py-3 bg-[#B8A99A] text-white text-sm tracking-wider uppercase">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
