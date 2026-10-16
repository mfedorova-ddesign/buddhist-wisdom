import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { LocaleProvider } from './i18n/locale';
import { FavoritesProvider } from './lib/favorites';
import { NarrationProvider } from './lib/narration';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element missing');

createRoot(root).render(
  <StrictMode>
    <LocaleProvider>
      <FavoritesProvider>
        <NarrationProvider>
          <App />
        </NarrationProvider>
      </FavoritesProvider>
    </LocaleProvider>
  </StrictMode>,
);
