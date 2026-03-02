// ============================================================
// pages/LoginPage.tsx
// ============================================================
// РУС: Страница входа. Форма с email и password.
//      При успехе → Redux сохраняет токен → redirect на /
// ESP: Página de login. Formulario que llama al backend y guarda el token en Redux.
//
// ПОТОК:
//   Форма → handleSubmit → dispatch(loginThunk) → loginAPI → бэк
//   → ответ { token, user } → Redux сохраняет → navigate('/')
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import { loginThunk, clearError } from '../store/authSlice';

export default function LoginPage() {
  // Форма — локальное состояние (только для этой страницы, не в Redux)
  const [form, setForm] = useState({ email: '', password: '' });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Читаем из Redux: статус загрузки, ошибку, текущего пользователя
  const { loading, error, user } = useAppSelector((state) => state.auth);

  // Если пользователь уже залогинен → redirect на главную
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]); // запускается когда user меняется

  // Сбросить ошибку при размонтировании страницы
  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, []);

  // ── ОБРАБОТЧИК ИЗМЕНЕНИЯ ПОЛЕЙ ────────────────────────────
  // Один обработчик для всех полей (name = имя поля из HTML)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Spread оператор: { ...form } = копируем всё что было
    // [name]: value = меняем только одно поле
    setForm({ ...form, [name]: value });
  };

  // ── ОТПРАВКА ФОРМЫ ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // отменяем стандартное поведение HTML формы (перезагрузку)

    // dispatch возвращает Promise от createAsyncThunk
    // .unwrap() = бросает ошибку если rejected (чтобы поймать в catch)
    try {
      await dispatch(loginThunk(form)).unwrap();
      navigate('/'); // успех → на главную
    } catch {
      // Ошибка уже сохранена в state.auth.error — показываем ниже
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ── ЗАГОЛОВОК ──────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
            <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">
              Acceso
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#3D3D3D] mb-2">
            Bienvenida de nuevo
          </h1>
          <p className="text-[#666666] font-light text-sm">
            Entra para gestionar tus reservas
          </p>
        </div>

        {/* ── ФОРМА ─────────────────────────────────────── */}
        <div className="card">
          {/* Показываем ошибку если есть */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* onSubmit = вызываем handleSubmit при отправке формы */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"         // name = ключ для handleChange
                value={form.email}   // контролируемый input (React управляет значением)
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="input-field"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {/* КНОПКА */}
            <button
              type="submit"
              disabled={loading} // disabled когда запрос в процессе
              className="btn-primary w-full mt-6"
            >
              {/* Показываем "загрузка" или обычный текст */}
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          {/* ССЫЛКА НА РЕГИСТРАЦИЮ */}
          <p className="text-center text-sm text-[#666666] mt-4">
            ¿Primera vez?{' '}
            <Link to="/register" className="text-[#B8A99A] hover:text-[#9A8B7A] font-medium">
              Crear cuenta
            </Link>
          </p>
        </div>

        {/* Divider decorativo */}
        <div className="gold-divider mt-8" />
      </div>
    </div>
  );
}
