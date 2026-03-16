import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import { loginThunk, clearError, googleAuthThunk } from '../store/authSlice';
import { useLanguage } from '../i18n/LanguageContext';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const { tr } = useLanguage();

  const handleGoogle = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (r) => {
      try {
        await dispatch(googleAuthThunk(r.access_token)).unwrap();
        navigate('/');
      } catch { /* error saved in state */ }
    },
    onError: () => dispatch({ type: 'auth/google/rejected', payload: 'Error al conectar con Google' }),
  });

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginThunk(form)).unwrap();
      navigate('/');
    } catch { /* error saved in state.auth.error */ }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel (desktop) */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[40%] bg-[#2A2220] flex-col justify-between p-12 xl:p-16 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #B8A99A 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#B8A99A] mb-10 font-light">{tr.login.estudio}</p>
          <h1 className="font-serif text-5xl xl:text-6xl text-white font-light tracking-wide leading-[1.1]">
            Keratin<br />Madrid
          </h1>
        </div>
        <div className="relative z-10">
          <div className="w-10 h-px bg-[#B8A99A] mb-7" />
          <p className="font-serif text-xl text-[#c0b8b0] font-light leading-relaxed italic" style={{ whiteSpace: 'pre-line' }}>
            {tr.login.quote}
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#6a6560] mt-6 font-light">Calle Altamirano, 33 &mdash; Madrid</p>
        </div>
        <div className="relative z-10 flex gap-5">
          <a href="https://www.instagram.com/keratin_madrid" target="_blank" rel="noopener noreferrer" className="text-[#6a6560] hover:text-[#B8A99A] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.tiktok.com/@keratin_madrid" target="_blank" rel="noopener noreferrer" className="text-[#6a6560] hover:text-[#B8A99A] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/></svg>
          </a>
          <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="text-[#6a6560] hover:text-[#B8A99A] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-[#FAF8F5] flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden text-center mb-10">
            <p className="font-serif text-3xl text-[#3D3530] font-light tracking-wide">Keratin Madrid</p>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8A99A] mt-2 font-light">{tr.login.estudio}</p>
          </div>
          <div className="mb-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#8B7355] mb-3 font-medium">{tr.login.overline}</p>
            <h2 className="font-serif text-3xl text-[#3D3530] mb-2 font-light tracking-wide">{tr.login.title}</h2>
            <p className="text-sm text-[#7a6f68]">{tr.login.subtitle}</p>
          </div>
          {error && (
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-2 font-medium">{tr.login.email}</label>
              <input id="email" type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="tu@email.com"
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:ring-1 focus:ring-[#B8A99A]/50 focus:border-[#B8A99A] transition-colors"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-2 font-medium">{tr.login.password}</label>
              <input id="password" type="password" name="password" value={form.password}
                onChange={handleChange} required placeholder="••••••••"
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:ring-1 focus:ring-[#B8A99A]/50 focus:border-[#B8A99A] transition-colors"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-[#3d3530] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#2d2520] transition-colors disabled:opacity-50 mt-1 font-medium">
              {loading ? tr.login.entrando : tr.login.entrar}
            </button>
          </form>
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#e8e2da]"/>
            <span className="text-[11px] tracking-[0.15em] uppercase text-[#b5ada5]">o</span>
            <div className="flex-1 h-px bg-[#e8e2da]"/>
          </div>
          <button
            type="button"
            onClick={() => handleGoogle()}
            disabled={loading}
            className="w-full py-3.5 border border-[#e8e2da] bg-white flex items-center justify-center gap-3 text-[12px] tracking-[0.12em] uppercase text-[#3d3530] hover:border-[#B8A99A] hover:bg-[#faf8f5] transition-all disabled:opacity-50 font-normal"
          >
            <GoogleIcon />
            Continuar con Google
          </button>
          <div className="mt-7 pt-6 border-t border-[#ede8e2] text-center">
            <p className="text-sm text-[#8B7355]">
              {tr.login.primeraVez}{' '}
              <Link to="/register" className="text-[#3d3530] font-semibold border-b border-[#3d3530]/30 hover:border-[#3d3530] transition-colors">{tr.login.crearCuenta}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
