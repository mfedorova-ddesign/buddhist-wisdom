import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Copy, Locale } from '../types';
import { messages, type Messages } from './messages';

const STORAGE_KEY = 'stillness.locale.v1';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  m: Messages;
  tx: (copy: Copy) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function storedLocale(): Locale {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === 'uk' || value === 'en') return value;
  } catch {
    /* private mode or blocked storage */
  }
  return 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(storedLocale);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* keep the choice for this visit */
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale === 'uk' ? 'uk' : 'en';
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      m: messages[locale],
      tx: (copy) => copy[locale],
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useI18n must be used within LocaleProvider');
  return value;
}
