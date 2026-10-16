export type Locale = 'en' | 'uk';

export type Copy = { en: string; uk: string };

export type TopicId = 'anger' | 'attachment' | 'compassion' | 'fear' | 'everyday';

export const CONTENT_KINDS = ['parable', 'wisdom', 'meditation'] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];

export type ContentLabel = 'direct-translation' | 'retelling' | 'editorial-summary';

export type Block =
  | { type: 'paragraph'; text: Copy }
  | { type: 'label'; text: Copy }
  | { type: 'verse'; lines: { en: string[]; uk: string[] } }
  | { type: 'quote'; text: Copy; caption: Copy };

export type NarrationSource = { type: 'speech' } | { type: 'file'; src: string };

export interface Story {
  id: string;
  slug: string;
  title: Copy;
  shortDescription: Copy;
  excerpt: Copy;
  blocks: Block[];
  category: TopicId;
  contentType: ContentKind;
  sourceTradition: Copy;
  sourceTitle: Copy;
  sourceReference: Copy;
  sourceUrl: string | null;
  contentLabel: { en: ContentLabel; uk: ContentLabel };
  translationNote: Copy;
  aboutSource: Copy;
  verified: boolean;
  readingTime: { en: number; uk: number };
  audioText: Copy;
  narration: NarrationSource;
}

export interface Topic {
  id: TopicId;
  label: Copy;
  description: Copy;
}
