// ============================================================
// hooks/useAppHooks.ts — Hooks tipados de Redux
// ============================================================
// Versiones tipadas de useDispatch y useSelector.
// Se usan en vez de los hooks originales para que TypeScript
// conozca la estructura del state y los thunks disponibles.
// ============================================================

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// const loading = useAppSelector((state) => state.auth.loading);
//
// dispatch(loginThunk({ email, password }));