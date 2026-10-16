import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'stillness.favorites.v1';

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids = parsed.filter((item): item is string => typeof item === 'string' && item.length > 0);
    return [...new Set(ids)];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Private mode or a full disk: keep the in-memory list for this visit.
  }
}

interface FavoritesContextValue {
  ids: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readFavorites());

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setIds(readFavorites());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids,
      isSaved: (id: string) => ids.includes(id),
      toggle: (id: string) => {
        setIds((current) => {
          const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
          writeFavorites(next);
          return next;
        });
      },
    }),
    [ids],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error('useFavorites must be used within FavoritesProvider');
  return value;
}
