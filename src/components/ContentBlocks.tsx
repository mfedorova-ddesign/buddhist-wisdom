import { useI18n } from '../i18n/locale';
import type { Block } from '../types';

export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  const { locale, tx } = useI18n();

  return (
    <div className="reading-body">
      {blocks.map((block, index) => {
        if (block.type === 'label') {
          return (
            <p className="verse-label" key={index}>
              {tx(block.text)}
            </p>
          );
        }
        if (block.type === 'verse') {
          return (
            <p className="verse" key={index}>
              {block.lines[locale].join('\n')}
            </p>
          );
        }
        if (block.type === 'quote') {
          return (
            <figure className="quotation" key={index}>
              <blockquote>
                {tx(block.text)
                  .split('\n\n')
                  .map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
              </blockquote>
              <figcaption>{tx(block.caption)}</figcaption>
            </figure>
          );
        }
        return <p key={index}>{tx(block.text)}</p>;
      })}
    </div>
  );
}
