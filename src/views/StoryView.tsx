import { AudioPlayer } from '../components/AudioPlayer';
import { ContentBlocks } from '../components/ContentBlocks';
import { FavoriteButton } from '../components/FavoriteButton';
import { Link } from '../components/Link';
import { StoryCard } from '../components/StoryCard';
import { adjacentStories, getStoryBySlug, otherStoriesInTopic } from '../data/stories';
import { topicById } from '../data/topics';
import { useI18n } from '../i18n/locale';
import { formatReadingTime } from '../lib/format';
import { libraryHref, storyHref } from '../lib/router';

export function StoryView({ slug }: { slug: string }) {
  const { locale, m, tx } = useI18n();
  const story = getStoryBySlug(slug);

  if (!story) {
    return (
      <div className="wrap reading missing">
        <h1>{m.notFoundTitle}</h1>
        <p>{m.notFoundBody}</p>
        <Link className="button" href="/library">
          {m.goLibrary}
        </Link>
      </div>
    );
  }

  const topic = topicById(story.category);
  const related = otherStoriesInTopic(story);
  const { previous, next } = adjacentStories(story);
  const label = story.contentLabel[locale];

  return (
    <article className="wrap story-page">
      <div className="story-layout">
        <header className="story-head">
          <nav className="crumbs" aria-label={m.breadcrumb}>
            <Link href="/library">{m.library}</Link>
            <span aria-hidden="true">/</span>
            <Link href={libraryHref({ topic: story.category })}>{tx(topic.label)}</Link>
          </nav>
          <p className="kicker story-kicker">
            {m.kind[story.contentType]}
            <span aria-hidden="true"> · </span>
            {formatReadingTime(story.readingTime[locale], locale)}
          </p>
          <h1>{tx(story.title)}</h1>
          <p className="dek">{tx(story.shortDescription)}</p>
          <p className={`content-label label-${label}`}>{m.label[label]}</p>
          <p className="translation-note">{tx(story.translationNote)}</p>
          {!story.verified ? (
            <p className="unverified" role="note">
              {m.unverified}
            </p>
          ) : null}
        </header>

        <aside className="story-aside">
          <FavoriteButton storyId={story.id} />
          <AudioPlayer story={story} />
          <section className="source-panel" aria-labelledby="source-heading">
            <h2 id="source-heading">{m.source}</h2>
            <dl>
              <div>
                <dt>{m.text}</dt>
                <dd>{tx(story.sourceTitle)}</dd>
              </div>
              <div>
                <dt>{m.reference}</dt>
                <dd>{tx(story.sourceReference)}</dd>
              </div>
              <div>
                <dt>{m.tradition}</dt>
                <dd>{tx(story.sourceTradition)}</dd>
              </div>
            </dl>
            {story.sourceUrl ? (
              <a className="source-link" href={story.sourceUrl} target="_blank" rel="noreferrer">
                {m.readSource}
                <span className="sr-only"> {m.newTab}</span>
              </a>
            ) : (
              <p className="source-missing">{m.noSourceLink}</p>
            )}
          </section>
        </aside>

        <div className="story-main">
          <ContentBlocks blocks={story.blocks} />
          <section className="about" aria-labelledby="about-heading">
            <h2 id="about-heading">{m.aboutSource}</h2>
            <p>{tx(story.aboutSource)}</p>
          </section>
        </div>

        <footer className="story-foot">
          {related.length > 0 ? (
            <section className="related" aria-labelledby="related-heading">
              <div className="section-head">
                <h2 id="related-heading">
                  {m.moreIn} {tx(topic.label)}
                </h2>
                <Link href={libraryHref({ topic: story.category })}>{m.allInTopic}</Link>
              </div>
              <div className="entry-list">
                {related.map((item, index) => (
                  <StoryCard key={item.id} story={item} index={index + 1} headingLevel="h3" />
                ))}
              </div>
            </section>
          ) : null}

          <nav className="pager" aria-label={m.adjacent}>
            {previous ? (
              <Link className="pager-link" href={storyHref(previous.slug)}>
                <span>{m.previous}</span>
                <strong>{tx(previous.title)}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="pager-link next" href={storyHref(next.slug)}>
                <span>{m.next}</span>
                <strong>{tx(next.title)}</strong>
              </Link>
            ) : null}
          </nav>
        </footer>
      </div>
    </article>
  );
}
