// ============================================================
// store/authSlice.ts — Slice de autenticación (Redux Toolkit)
// ============================================================
// Gestiona el estado de autenticación: usuario actual, token,
// estado de carga y errores. Contiene tres thunks asíncronos
// (login, register, getMe) y dos acciones síncronas (logout,
// clearError). El token se persiste en localStorage.
//
// Flujo de datos:
//   Componente → dispatch(thunk) → API → backend → respuesta → state
// ============================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI, getMeAPI } from '../api/auth.api';
import type { User, LoginForm, RegisterForm } from '../types';

// Forma del estado de autenticación
interface AuthState {
  user: User | null;    // null = no logueado
  token: string | null; // JWT token
  loading: boolean;     // true mientras hay una petición en curso
  error: string | null; // mensaje de error
}

// Al cargar la página, leemos el token de localStorage
// para no perder la sesión al cerrar y reabrir el navegador
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// ── THUNKS ASÍNCRONOS ────────────────────────────────────────
// createAsyncThunk genera automáticamente tres estados:
//   pending   → petición en curso
//   fulfilled → éxito (devuelve datos)
//   rejected  → error

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: LoginForm, { rejectWithValue }) => {
    try {
      const res = await loginAPI(data);
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || 'Error al iniciar sesión');
    }
  }
);

// REGISTER
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: RegisterForm, { rejectWithValue }) => {
    try {
      const res = await registerAPI(data);
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || 'Error al registrarse');
    }
  }
);

// GET ME — restaurar sesión al recargar la página
export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async () => {
    const res = await getMeAPI();
    return res.data;
  }
);

// ── SLICE ────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,

  // Acciones síncronas (no requieren API)
  reducers: {
    // Cerrar sesión: limpia state y localStorage
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    // Limpiar el error (por ejemplo al cerrar el mensaje)
    clearError: (state) => {
      state.error = null;
    },
  },

  // Gestionar los estados de los thunks asíncronos
  extraReducers: (builder) => {

    // ── LOGIN ──
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Error al iniciar sesión';
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
        state.error = (action.payload as string) || 'Error al registrarse';
      })

    // ── GET ME ──
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getMeThunk.rejected, () => {
        // Token inválido → limpiamos localStorage
        localStorage.removeItem('token');
      });
  },
});

// Exportamos las acciones síncronas
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;