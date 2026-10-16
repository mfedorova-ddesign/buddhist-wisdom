import { Play } from 'lucide-react';
import { Link } from '../components/Link';
import { stories, storiesForTopic, storyOfTheDay } from '../data/stories';
import { TOPICS, topicById } from '../data/topics';
import { CONTENT_KINDS } from '../types';
import { countNoun } from '../i18n/messages';
import { useI18n } from '../i18n/locale';
import { formatIndex, formatReadingTime } from '../lib/format';
import { useNarration } from '../lib/narration';
import { libraryHref, navigate, storyHref } from '../lib/router';

export function HomeView() {
  const featured = storyOfTheDay();
  const topic = topicById(featured.category);
  const { play } = useNarration();
  const { locale, m, tx } = useI18n();
  const today = new Date().toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const kindCounts = CONTENT_KINDS.map((kind) => {
    const count = stories.filter((story) => story.contentType === kind).length;
    return `${count} ${countNoun(locale, count, kind)}`;
  });
  const guideLead =
    locale === 'uk'
      ? `${kindCounts[0]}, ${kindCounts[1]} і ${kindCounts[2]}. Позначка на кожній сторінці каже, чи ви читаєте переклад, чи виклад.`
      : `${kindCounts[0]}, ${kindCounts[1]}, and ${kindCounts[2]}. The label on each page tells you whether you are reading a translation or a summary.`;

  return (
    <div className="wrap home">
      <section className="masthead">
        <div>
          <p className="kicker">{m.readingCollection}</p>
          <h1>{m.headline}</h1>
        </div>
        <div className="masthead-side">
          <p>{m.intro}</p>
          <ol className="paths">
            <li>
              <a href="#today">
                <span className="index-no">{formatIndex(1)}</span>
                <span>{m.pathToday}</span>
              </a>
            </li>
            <li>
              <Link href="/library">
                <span className="index-no">{formatIndex(2)}</span>
                <span>{m.pathLibrary}</span>
              </Link>
            </li>
            <li>
              <a href="#topics">
                <span className="index-no">{formatIndex(3)}</span>
                <span>{m.pathTopics}</span>
              </a>
            </li>
          </ol>
        </div>
      </section>

      <section id="today" className="cover" aria-labelledby="featured-heading">
        <p className="kicker">{today}</p>
        <div className="cover-grid">
          <div>
            <h2 id="featured-heading">{m.storyOfDay}</h2>
            <p className="cover-kicker">
              {tx(topic.label)}
              <span aria-hidden="true"> · </span>
              {m.kind[featured.contentType]}
            </p>
            <h3>
              <Link href={storyHref(featured.slug)}>{tx(featured.title)}</Link>
            </h3>
            <blockquote className="pull">{tx(featured.excerpt)}</blockquote>
            <p className="excerpt-source">{tx(featured.sourceReference)}</p>
          </div>
          <div className="featured-actions">
            <p className="meta-line">
              <span>{formatReadingTime(featured.readingTime[locale], locale)}</span>
              <span>{m.label[featured.contentLabel[locale]]}</span>
            </p>
            <div className="button-row">
              <Link className="button" href={storyHref(featured.slug)}>
                {m.readStory}
              </Link>
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  navigate(`${storyHref(featured.slug)}#listen`);
                  play(featured);
                }}
              >
                <Play size={16} strokeWidth={1.5} aria-hidden="true" />
                {m.listen}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="topics" className="section" aria-labelledby="topics-heading">
        <div className="section-head">
          <h2 id="topics-heading">{m.fiveTopics}</h2>
          <p>{m.topicsIntro}</p>
        </div>
        <ol className="topic-index">
          {TOPICS.map((item, index) => {
            const count = storiesForTopic(item.id).length;
            return (
              <li key={item.id}>
                <Link href={libraryHref({ topic: item.id })}>
                  <span className="index-no">{formatIndex(index + 1)}</span>
                  <span className="topic-copy-block">
                    <span className="topic-label">{tx(item.label)}</span>
                    <span className="topic-copy">{tx(item.description)}</span>
                  </span>
                  <span className="topic-count">
                    {count} {countNoun(locale, count, 'text')}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="section guide" aria-labelledby="guide-heading">
        <div className="section-head">
          <h2 id="guide-heading">{m.howToRead}</h2>
          <p>{guideLead}</p>
        </div>
        <div className="guide-grid">
          {CONTENT_KINDS.map((kind) => (
            <article key={kind}>
              <h3>
                <Link href={libraryHref({ kind })}>{m.kindPlural[kind]}</Link>
              </h3>
              <p>{m.kindBody[kind]}</p>
            </article>
          ))}
        </div>
        <Link className="button" href="/library">
          {m.openLibrary}
        </Link>
      </section>
    </div>
  );
}
