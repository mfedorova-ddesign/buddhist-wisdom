import { useId } from 'react';
import { Link } from '../components/Link';
import { StoryCard } from '../components/StoryCard';
import { filterStories, stories } from '../data/stories';
import { TOPICS, topicById } from '../data/topics';
import { describeResults } from '../i18n/messages';
import { useI18n } from '../i18n/locale';
import { useFavorites } from '../lib/favorites';
import { libraryHref, navigate, type Route } from '../lib/router';
import { CONTENT_KINDS, type ContentKind, type Story, type TopicId } from '../types';

export function LibraryView({ route }: { route: Extract<Route, { view: 'library' }> }) {
  const searchId = useId();
  const topicLabelId = useId();
  const kindLabelId = useId();
  const { ids } = useFavorites();
  const { locale, m, tx } = useI18n();
  const savedIds = new Set(ids);
  const savedCount = stories.filter((story) => savedIds.has(story.id)).length;
  const matched = filterStories(stories, { q: route.q, topic: route.topic, kind: route.kind });
  const visible = route.saved ? matched.filter((story) => savedIds.has(story.id)) : matched;
  const dirty = route.topic !== 'all' || route.kind !== 'all' || route.q.trim() !== '' || route.saved;
  const activeTopic = route.topic === 'all' ? null : topicById(route.topic);
  const grouped = route.topic === 'all';
  const emptySaved = route.saved && !route.q.trim() && route.topic === 'all' && route.kind === 'all';
  const catalogLead =
    locale === 'uk'
      ? `${stories.length} коротких текстів із палійського канону: притчі, уривки зі священних книг і медитації.`
      : `${stories.length} short texts from the Pali canon: parables, passages from the sacred books, and meditations.`;

  const update = (
    next: { topic?: TopicId | 'all'; kind?: ContentKind | 'all'; q?: string; saved?: boolean },
    mode: 'push' | 'replace',
  ) => {
    navigate(
      libraryHref({
        topic: next.topic ?? route.topic,
        kind: next.kind ?? route.kind,
        q: next.q ?? route.q,
        saved: next.saved ?? route.saved,
      }),
      mode,
    );
  };

  const groups = TOPICS.map((topic) => ({
    topic,
    items: visible.filter((story) => story.category === topic.id),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="wrap library">
      <header className="library-head">
        <p className="kicker">
          <Link href="/library">{m.library}</Link>
          {activeTopic ? (
            <>
              <span aria-hidden="true"> / </span>
              <span>{tx(activeTopic.label)}</span>
            </>
          ) : null}
        </p>
        <h1>
          {activeTopic ? tx(activeTopic.label) : route.kind === 'all' ? m.exploreLibrary : m.kindPlural[route.kind]}
        </h1>
        <p>{activeTopic ? tx(activeTopic.description) : route.kind === 'all' ? catalogLead : m.kindBody[route.kind]}</p>
      </header>

      <div className="toolbar">
        <div className="search-field">
          <label htmlFor={searchId}>{m.search}</label>
          <input
            id={searchId}
            type="search"
            value={route.q}
            placeholder={m.searchPlaceholder}
            autoComplete="off"
            onChange={(event) => update({ q: event.target.value }, 'replace')}
          />
        </div>

        <div>
          <p id={topicLabelId} className="filter-label">
            {m.topic}
          </p>
          <div className="filters" role="group" aria-labelledby={topicLabelId}>
            <button type="button" className="filter" aria-pressed={route.topic === 'all'} onClick={() => update({ topic: 'all' }, 'push')}>
              {m.allTopics}
            </button>
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="filter"
                aria-pressed={route.topic === topic.id}
                onClick={() => update({ topic: topic.id }, 'push')}
              >
                {tx(topic.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-row">
          <div>
            <p id={kindLabelId} className="filter-label">
              {m.contentType}
            </p>
            <div className="filters" role="group" aria-labelledby={kindLabelId}>
              <button type="button" className="filter" aria-pressed={route.kind === 'all'} onClick={() => update({ kind: 'all' }, 'push')}>
                {m.all}
              </button>
              {CONTENT_KINDS.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  className="filter"
                  aria-pressed={route.kind === kind}
                  onClick={() => update({ kind }, 'push')}
                >
                  {m.kindPlural[kind]}
                </button>
              ))}
              <button type="button" className="filter" aria-pressed={route.saved} onClick={() => update({ saved: !route.saved }, 'push')}>
                {m.saved}
                {savedCount > 0 ? ` · ${savedCount}` : ''}
              </button>
            </div>
          </div>
          <button type="button" className="button secondary" onClick={() => navigate('/library')} disabled={!dirty}>
            {m.reset}
          </button>
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {describeResults(locale, {
          count: visible.length,
          saved: route.saved,
          kind: route.kind,
          topic: activeTopic ? tx(activeTopic.label) : null,
          query: route.q.trim(),
        })}
      </p>

      {visible.length === 0 ? (
        <div className="empty">
          <p>{emptySaved ? m.nothingSaved : m.noMatch}</p>
          <p>{emptySaved ? m.nothingSavedHint : m.noMatchHint}</p>
          {dirty ? (
            <button type="button" className="button" onClick={() => navigate('/library')}>
              {m.reset}
            </button>
          ) : null}
        </div>
      ) : grouped ? (
        <div className="catalog">
          {groups.map((group) => (
            <section key={group.topic.id} className="catalog-group" aria-labelledby={`group-${group.topic.id}`}>
              <div className="group-head">
                <h2 id={`group-${group.topic.id}`}>{tx(group.topic.label)}</h2>
                <p>{tx(group.topic.description)}</p>
              </div>
              <div className="entry-list">
                {group.items.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index + 1} headingLevel="h3" />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="entry-list">
          {visible.map((story: Story, index) => (
            <StoryCard key={story.id} story={story} index={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
