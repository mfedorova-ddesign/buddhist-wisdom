import { useI18n } from '../i18n/locale';
import { formatIndex, formatReadingTime } from '../lib/format';
import { navigate, storyHref } from '../lib/router';
import type { Story } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { Link } from './Link';

export function StoryCard({
  story,
  headingLevel = 'h2',
  index,
}: {
  story: Story;
  headingLevel?: 'h2' | 'h3';
  index?: number;
}) {
  const { locale, m, tx } = useI18n();
  const Title = headingLevel;

  return (
    <article
      className="entry index-row"
      onClick={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest('a, button')) return;
        if (window.getSelection()?.toString()) return;
        navigate(storyHref(story.slug));
      }}
    >
      {index != null ? <span className="index-no">{formatIndex(index)}</span> : <span className="index-no" aria-hidden="true" />}
      <div className="index-main">
        <p className="kicker">{m.kind[story.contentType]}</p>
        <Title className="entry-title">
          <Link href={storyHref(story.slug)}>{tx(story.title)}</Link>
        </Title>
        <p className="entry-dek">{tx(story.shortDescription)}</p>
      </div>
      <div className="entry-meta">
        <span>{tx(story.sourceReference)}</span>
        <span>{formatReadingTime(story.readingTime[locale], locale)}</span>
        <span>{m.label[story.contentLabel[locale]]}</span>
        <FavoriteButton storyId={story.id} />
      </div>
    </article>
  );
}
