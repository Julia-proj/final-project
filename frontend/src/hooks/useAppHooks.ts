// ============================================================
// hooks/useAppHooks.ts
// ============================================================
// РУС: Типизированные версии стандартных Redux хуков.
//      Нужны чтобы TypeScript знал структуру нашего store.
// ESP: Versiones tipadas de los hooks de Redux para que TypeScript funcione bien.
//
// 📦 ФОРМУЛА: useDispatch<AppDispatch>() и useSelector<RootState>
//
// ЗАЧЕМ? Без этого TypeScript не знает какие поля есть в state.
//   ❌ useSelector((state) => state.auth) — TypeScript: "что такое auth?"
//   ✅ useAppSelector((state) => state.auth) — TypeScript знает структуру!
// ============================================================

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// 📦 ФОРМУЛА для dispatch — просто типизируем стандартный хук
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 📦 ФОРМУЛА для selector — TypedUseSelectorHook знает форму нашего state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ── КАК ИСПОЛЬЗОВАТЬ В КОМПОНЕНТЕ ────────────────────────────
//
// import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
//
// const dispatch = useAppDispatch();
// const user = useAppSelector((state) => state.auth.user);
// const loading = useAppSelector((state) => state.auth.loading);
//
// dispatch(loginThunk({ email, password }));