// ============================================================
// store/authSlice.ts
// ============================================================
// РУС: "Срез" (slice) = кусок глобального состояния для аутентификации.
//      Хранит: кто залогинен, токен, статус загрузки, ошибки.
// ESP: Slice de autenticación: guarda usuario, token, loading y errores.
//
// ПОТОК ДАННЫХ:
//   Component → dispatch(loginThunk) → loginAPI → бэк → ответ → state обновляется
//
// 📦 ФОРМУЛЫ:
//   createSlice()       — создаёт срез Redux
//   createAsyncThunk()  — создаёт async action (для API запросов)
//   builder.addCase()   — обрабатывает результат async action
// ============================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI, getMeAPI } from '../api/auth.api';
import type { User, LoginForm, RegisterForm } from '../types';

// ── TYPESCRIPT: ФОРМА СОСТОЯНИЯ ──────────────────────────────
// Описываем что будет лежать в state.auth
interface AuthState {
  user: User | null;    // null = не залогинен
  token: string | null; // JWT токен
  loading: boolean;     // true пока запрос в процессе
  error: string | null; // сообщение об ошибке
}

// ── НАЧАЛЬНОЕ СОСТОЯНИЕ ──────────────────────────────────────
// При загрузке страницы читаем токен из localStorage
// (пользователь мог закрыть вкладку и снова открыть — не хотим разлогинивать)
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'), // 📦 ФОРМУЛА: getItem('ключ')
  loading: false,
  error: null,
};

// ── ASYNC THUNKS ─────────────────────────────────────────────
// 📦 ФОРМУЛА: createAsyncThunk('имя_среза/имя_action', async (аргумент) => { })
// Автоматически создаёт три action type:
//   'auth/login/pending'   → запрос отправлен
//   'auth/login/fulfilled' → успех (возвращает данные)
//   'auth/login/rejected'  → ошибка

// LOGIN
export const loginThunk = createAsyncThunk(
  'auth/login',                         // 🎨 имя — придумали сами
  async (data: LoginForm) => {          // data = то что передаст компонент
    const res = await loginAPI(data);   // вызываем API функцию
    return res.data;                    // возвращаем ответ: { token, user }
    // это попадёт в action.payload в fulfilled
  }
);

// REGISTER
export const registerThunk = createAsyncThunk(
  'auth/register',                      // 🎨 имя придумали сами
  async (data: RegisterForm) => {
    const res = await registerAPI(data);
    return res.data;                    // { token, user }
  }
);

// GET ME — восстанавливаем сессию при перезагрузке
// Если есть токен → спрашиваем бэк "кто я?"
export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async () => {
    const res = await getMeAPI();
    return res.data; // { id, name, email, role }
  }
);

// ── SLICE ────────────────────────────────────────────────────
// 📦 ФОРМУЛА: createSlice({ name, initialState, reducers, extraReducers })

const authSlice = createSlice({
  name: 'auth',              // 🎨 имя — используется в DevTools
  initialState,              // начальное состояние (объявили выше)

  // reducers = синхронные actions (не API запросы)
  reducers: {
    // LOGOUT — очищаем состояние и localStorage
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // удаляем токен из браузера
    },
    // clearError — сброс ошибки (например при закрытии алерта)
    clearError: (state) => {
      state.error = null;
    },
  },

  // extraReducers = обработка async thunk (pending/fulfilled/rejected)
  // 📦 ФОРМУЛА: builder.addCase(thunk.состояние, (state, action) => { })
  extraReducers: (builder) => {

    // ── LOGIN ──
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;   // показываем спиннер
        state.error = null;     // сбрасываем старые ошибки
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        // action.payload = то что вернул наш thunk (res.data)
        state.loading = false;
        state.user = action.payload.user;   // сохраняем пользователя
        state.token = action.payload.token; // сохраняем токен
        localStorage.setItem('token', action.payload.token); // сохраняем в браузер
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al iniciar sesión';
      })

    // ── REGISTER ──
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al registrarse';
      })

    // ── GET ME ──
      .addCase(getMeThunk.fulfilled, (state, action) => {
        // Просто сохраняем пользователя, токен уже в state (из localStorage)
        state.user = action.payload;
      })
      .addCase(getMeThunk.rejected, () => {
        // Токен невалидный → чистим localStorage
        localStorage.removeItem('token');
      });
  },
});

// Экспортируем actions для использования в компонентах
export const { logout, clearError } = authSlice.actions;

// Экспортируем reducer — он войдёт в store.ts
export default authSlice.reducer;