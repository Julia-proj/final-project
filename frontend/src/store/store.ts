// ============================================================
// store/store.ts — Configuración del store de Redux
// ============================================================
// Aquí se crea el store principal que une todos los slices.
// Actualmente tiene un slice: auth (autenticación).
// También exporta los tipos RootState y AppDispatch que
// se usan en los hooks tipados.
// ============================================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Tipos para TypeScript — necesarios para los hooks tipados
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;