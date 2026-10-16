import { Menu, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { APP_NAME } from '../config';
import { useI18n } from '../i18n/locale';
import type { Route } from '../lib/router';
import type { Locale } from '../types';
import { Link } from './Link';

const LOCALES: { id: Locale; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'uk', label: 'UA' },
];

export function Header({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { locale, setLocale, m } = useI18n();

  useEffect(() => {
    setOpen(false);
  }, [route]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap header-bar">
        <Link href="/" className="brand">
          <span className="wordmark">{APP_NAME}</span>
          <span className="brand-note">{m.brandNote}</span>
        </Link>
        <div className="lang-switch" role="group" aria-label={locale === 'uk' ? 'Мова' : 'Language'}>
          {LOCALES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={locale === item.id}
              onClick={() => setLocale(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}
          {open ? m.closeMenu : m.menu}
        </button>
        <nav id={menuId} className={open ? 'nav is-open' : 'nav'} aria-label={m.mainNav}>
          <Link href="/" aria-current={route.view === 'home' ? 'page' : undefined}>
            {m.home}
          </Link>
          <Link href="/library" aria-current={route.view === 'library' ? 'page' : undefined}>
            {m.library}
          </Link>
        </nav>
      </div>
    </header>
  );
}
