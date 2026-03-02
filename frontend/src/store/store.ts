// ============================================================
// store/store.ts
// ============================================================
// РУС: Главный "магазин" Redux — объединяет все slices.
//      Сейчас у нас один slice (auth), но можно добавлять больше.
// ESP: La tienda principal de Redux. Une todos los slices (partes del estado).
//
// 📦 ФОРМУЛА: configureStore({ reducer: { имя: reducer } })
//
// АНАЛОГИЯ: Store = большой шкаф
//   Каждый slice = ящик в шкафу
//   state.auth = ящик "авторизация"
// ============================================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // reducer из нашего slice

// 📦 ФОРМУЛА: configureStore({ reducer: { ... } })
export const store = configureStore({
  reducer: {
    auth: authReducer, // 🎨 имя 'auth' — мы придумали сами
    // Позже можно добавить:
    // bookings: bookingsReducer,
  },
});

// ── TYPESCRIPT ТИПЫ ──────────────────────────────────────────
// Эти типы нужны для типизированных хуков useSelector и useDispatch

// RootState = полная форма всего state
// ReturnType<X> = "возьми тип, который возвращает функция X"
// store.getState = функция, которая возвращает весь state
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch = тип функции dispatch
// Нужен чтобы TypeScript знал о наших async thunks
export type AppDispatch = typeof store.dispatch;