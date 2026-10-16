import { useEffect, useRef } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { APP_NAME } from './config';
import { getStoryBySlug } from './data/stories';
import { useI18n } from './i18n/locale';
import { useRoute } from './lib/router';
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { StoryView } from './views/StoryView';

export function App() {
  const route = useRoute();
  const { locale, m, tx } = useI18n();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (route.view === 'library') document.title = `${m.libraryDoc} — ${APP_NAME}`;
    else if (route.view === 'story') {
      const story = getStoryBySlug(route.slug);
      document.title = story ? `${tx(story.title)} — ${APP_NAME}` : `${m.notFoundDoc} — ${APP_NAME}`;
    } else document.title = APP_NAME;
  }, [route, locale, m, tx]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
    const player = window.location.hash === '#listen' ? document.getElementById('listen') : null;
    if (player) player.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }, [route]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#content">
        {m.skip}
      </a>
      <Header route={route} />
      <main id="content" ref={mainRef} tabIndex={-1}>
        {route.view === 'home' ? <HomeView /> : null}
        {route.view === 'library' ? <LibraryView route={route} /> : null}
        {route.view === 'story' ? <StoryView slug={route.slug} /> : null}
      </main>
      <Footer />
    </div>
  );
}
