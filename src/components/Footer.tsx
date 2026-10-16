import { APP_NAME } from '../config';
import { TOPICS } from '../data/topics';
import { useI18n } from '../i18n/locale';
import { libraryHref } from '../lib/router';
import { Link } from './Link';

export function Footer() {
  const { m, tx } = useI18n();

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="wordmark footer-name">{APP_NAME}</p>
          <p>{m.footerNote}</p>
        </div>
        <div>
          <p className="kicker">{m.topics}</p>
          <nav className="footer-topics" aria-label={m.topics}>
            {TOPICS.map((topic) => (
              <Link key={topic.id} href={libraryHref({ topic: topic.id })}>
                {tx(topic.label)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="kicker">{m.sources}</p>
          <p>{m.sourcesBody}</p>
          <p>
            <a href="https://suttacentral.net/" target="_blank" rel="noreferrer">
              SuttaCentral
              <span className="sr-only"> {m.newTab}</span>
            </a>
            <span aria-hidden="true"> · </span>
            <a href="https://suttacentral.net/licensing" target="_blank" rel="noreferrer">
              {m.licensing}
              <span className="sr-only"> {m.newTab}</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
