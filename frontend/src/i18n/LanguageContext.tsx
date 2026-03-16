// ============================================================
// i18n/LanguageContext.tsx — Language context + hook
// ============================================================
// Provides { lang, setLang, tr } to the entire app.
// lang persists in localStorage.
// ============================================================

import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: typeof translations['es'];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('km_lang');
    if (saved === 'es' || saved === 'ru' || saved === 'en') return saved;
    return 'es';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('km_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
