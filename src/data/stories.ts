import { blocksToPlain, normalizeSearch, readingMinutes } from '../lib/format';
import { ukStories, type PlainBlock } from './stories.uk';
import { topicById } from './topics';
import type { Block, ContentKind, ContentLabel, Copy, Locale, Story, TopicId } from '../types';

/**
 * Library copy for Stillness.
 *
 * Direct quotations are from Bhikkhu Sujato’s English translations published
 * on SuttaCentral and dedicated to the public domain (CC0). Translator
 * footnotes are omitted. Editorial summaries were written for this prototype
 * from those same translations; they are not quotations and not retellings
 * of invented plots.
 *
 * No entry here is a modern parable attributed to the Buddha.
 */

const CC0 = 'English translation by Bhikkhu Sujato, dedicated to the public domain (CC0).';

interface RawStory {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  excerpt: string;
  blocks: PlainBlock[];
  category: TopicId;
  contentType: ContentKind;
  sourceTradition: string;
  sourceTitle: string;
  sourceReference: string;
  sourceUrl: string | null;
  contentLabel: ContentLabel;
  translationNote: string;
  aboutSource: string;
  verified: boolean;
}

function copy(en: string, uk: string): Copy {
  return { en, uk };
}

function zipBlock(en: PlainBlock, uk: PlainBlock, id: string, index: number): Block {
  if (en.type !== uk.type) {
    throw new Error(`${id}: block ${index} type mismatch`);
  }
  if (en.type === 'verse' && uk.type === 'verse') {
    if (en.lines.length !== uk.lines.length) {
      throw new Error(`${id}: verse ${index} has ${en.lines.length} English lines and ${uk.lines.length} Ukrainian lines`);
    }
    return { type: 'verse', lines: { en: en.lines, uk: uk.lines } };
  }
  if (en.type === 'quote' && uk.type === 'quote') {
    return {
      type: 'quote',
      text: copy(en.text, uk.text),
      caption: copy(en.caption, uk.caption),
    };
  }
  if (en.type === 'paragraph' && uk.type === 'paragraph') {
    return { type: 'paragraph', text: copy(en.text, uk.text) };
  }
  if (en.type === 'label' && uk.type === 'label') {
    return { type: 'label', text: copy(en.text, uk.text) };
  }
  throw new Error(`${id}: block ${index} cannot be paired`);
}

function spoken(
  story: {
    title: Copy;
    translationNote: Copy;
    sourceTitle: Copy;
    sourceReference: Copy;
    blocks: Block[];
  },
  locale: Locale,
): string {
  return [
    story.title[locale],
    story.translationNote[locale],
    `${story.sourceTitle[locale]}. ${story.sourceReference[locale]}.`,
    blocksToPlain(story.blocks, locale),
  ].join('\n\n');
}

function complete(story: RawStory): Story {
  const uk = ukStories[story.id];
  if (!uk) throw new Error(`Missing Ukrainian copy: ${story.id}`);
  if (uk.blocks.length !== story.blocks.length) {
    throw new Error(`${story.id}: Ukrainian block count ${uk.blocks.length} does not match ${story.blocks.length}`);
  }
  const localized = {
    id: story.id,
    slug: story.slug,
    category: story.category,
    contentType: story.contentType,
    sourceUrl: story.sourceUrl,
    verified: story.verified,
    title: copy(story.title, uk.title),
    shortDescription: copy(story.shortDescription, uk.shortDescription),
    excerpt: copy(story.excerpt, uk.excerpt),
    sourceTradition: copy(story.sourceTradition, uk.sourceTradition),
    sourceTitle: copy(story.sourceTitle, uk.sourceTitle),
    sourceReference: copy(story.sourceReference, uk.sourceReference),
    translationNote: copy(story.translationNote, uk.translationNote),
    aboutSource: copy(story.aboutSource, uk.aboutSource),
    contentLabel: { en: story.contentLabel, uk: uk.contentLabel },
    blocks: story.blocks.map((block, index) => zipBlock(block, uk.blocks[index], story.id, index)),
  };
  const audioText = { en: spoken(localized, 'en'), uk: spoken(localized, 'uk') };
  return {
    ...localized,
    audioText,
    readingTime: { en: readingMinutes(audioText.en), uk: readingMinutes(audioText.uk) },
    narration: { type: 'speech' },
  };
}

export const stories: Story[] = [
  complete({
    id: 'hatred-laid-to-rest',
    slug: 'hatred-laid-to-rest',
    title: 'Hatred Is Laid to Rest by Love',
    shortDescription:
      'Three opening verses on what a grudge keeps alive, and what lets it rest.',
    excerpt:
      'For never is hatred laid to rest by hate, it’s laid to rest by love: this is an ancient teaching.',
    category: 'anger',
    contentType: 'wisdom',
    sourceTradition: 'Theravāda, Pali canon',
    sourceTitle: 'Dhammapada',
    sourceReference: 'Yamakavagga, verses 3–5',
    sourceUrl: 'https://suttacentral.net/dhp1-20/en/sujato',
    contentLabel: 'direct-translation',
    translationNote:
      'Direct translation of verses 3–5. This is not the rest of the Dhammapada.',
    aboutSource:
      'The Dhammapada is a verse collection in the Khuddaka Nikāya of the Pali canon. Verses 3–5 belong to the first chapter, the Yamakavagga (“Pairs”). They are canonical verses. Later commentarial stories sometimes printed beside the Dhammapada are not included here. The English text is Bhikkhu Sujato’s translation, published by SuttaCentral and dedicated to the public domain under CC0.',
    verified: true,
    blocks: [
      { type: 'label', text: 'Verse 3' },
      {
        type: 'verse',
        lines: [
          '“They abused me, they hit me!',
          'They beat me, they robbed me!”',
          'For those who bear such a grudge,',
          'hatred is never laid to rest.',
        ],
      },
      { type: 'label', text: 'Verse 4' },
      {
        type: 'verse',
        lines: [
          '“They abused me, they hit me!',
          'They beat me, they robbed me!”',
          'For those who bear no such grudge,',
          'hatred is laid to rest.',
        ],
      },
      { type: 'label', text: 'Verse 5' },
      {
        type: 'verse',
        lines: [
          'For never is hatred',
          'laid to rest by hate,',
          'it’s laid to rest by love:',
          'this is an ancient teaching.',
        ],
      },
      { type: 'paragraph', text: CC0 },
    ],
  }),
  complete({
    id: 'intention-comes-first',
    slug: 'intention-comes-first',
    title: 'Intention Comes First',
    shortDescription:
      'The opening pair of the Dhammapada: speech and action follow intention, and the results follow them.',
    excerpt:
      'If with pure intent you speak or act, happiness follows you like a shadow that never leaves.',
    category: 'everyday',
    contentType: 'wisdom',
    sourceTradition: 'Theravāda, Pali canon',
    sourceTitle: 'Dhammapada',
    sourceReference: 'Yamakavagga, verses 1–2',
    sourceUrl: 'https://suttacentral.net/dhp1/en/sujato',
    contentLabel: 'direct-translation',
    translationNote:
      'Direct translation of verses 1–2. This is not the rest of the Dhammapada.',
    aboutSource:
      'These are the first two verses of the Dhammapada, in the chapter called Pairs. In Bhikkhu Sujato’s translation, the Pali word mano is rendered as “intention” rather than the more familiar “mind,” so that the ethical sequence — intention, action, consequence — stays visible. The translation is dedicated to the public domain (CC0) and published on SuttaCentral. Verse 2 is the pair of verse 1 on the same site.',
    verified: true,
    blocks: [
      { type: 'label', text: 'Verse 1' },
      {
        type: 'verse',
        lines: [
          'Intention is the leader of things;',
          'intention is first, they’re made by intention.',
          'If with corrupt intent',
          'you speak or act,',
          'suffering follows you,',
          'like a wheel, the ox’s foot.',
        ],
      },
      { type: 'label', text: 'Verse 2' },
      {
        type: 'verse',
        lines: [
          'Intention is the leader of things;',
          'intention is first, they’re made by intention.',
          'If with pure intent',
          'you speak or act,',
          'happiness follows you',
          'like a shadow that never leaves.',
        ],
      },
      { type: 'paragraph', text: CC0 },
    ],
  }),
  complete({
    id: 'drop-from-a-lotus',
    slug: 'drop-from-a-lotus',
    title: 'Like a Drop from a Lotus Leaf',
    shortDescription:
      'Selected verses on craving: how sorrow grows with it, and what letting go is said to do.',
    excerpt: 'Their sorrows fall from them, like a drop from a lotus-leaf.',
    category: 'attachment',
    contentType: 'wisdom',
    sourceTradition: 'Theravāda, Pali canon',
    sourceTitle: 'Dhammapada',
    sourceReference: 'Taṇhāvagga, verses 335, 336, 338, and 348',
    sourceUrl: 'https://suttacentral.net/dhp334-359/en/sujato',
    contentLabel: 'direct-translation',
    translationNote:
      'Direct translation of four selected verses. They are not one continuous passage.',
    aboutSource:
      'These verses are from the Taṇhāvagga, “Craving,” chapter 24 of the Dhammapada. Verses 335 and 336 follow one another. Verse 338 comes soon after, and verse 348 later in the same chapter. They are printed here as separate quotations. The English is Bhikkhu Sujato’s public-domain translation on SuttaCentral.',
    verified: true,
    blocks: [
      { type: 'label', text: 'Verse 335' },
      {
        type: 'verse',
        lines: [
          'Whoever is beaten by this wretched craving,',
          'this attachment to the world,',
          'their sorrow grows,',
          'like grass in the rain.',
        ],
      },
      { type: 'label', text: 'Verse 336' },
      {
        type: 'verse',
        lines: [
          'But whoever prevails over this wretched craving,',
          'so hard to get over in the world,',
          'their sorrows fall from them,',
          'like a drop from a lotus-leaf.',
        ],
      },
      { type: 'label', text: 'Verse 338' },
      {
        type: 'verse',
        lines: [
          'A tree grows back even when cut down,',
          'so long as its roots are strong and undamaged;',
          'suffering springs up again and again,',
          'so long as the tendency to craving is not pulled out.',
        ],
      },
      { type: 'label', text: 'Verse 348' },
      {
        type: 'verse',
        lines: [
          'Let go of the past, let go of the future,',
          'let go of the present, having gone beyond rebirth.',
          'With your heart freed in every respect,',
          'you’ll not come again to rebirth and old age.',
        ],
      },
      { type: 'paragraph', text: CC0 },
    ],
  }),
  complete({
    id: 'discourse-on-love',
    slug: 'discourse-on-love',
    title: 'The Discourse on Love',
    shortDescription:
      'The Mettā Sutta: a short canonical poem on the stance of goodwill toward all beings.',
    excerpt:
      'Even as a mother would protect with her life her child, her only child, so too for all creatures unfold a boundless heart.',
    category: 'compassion',
    contentType: 'meditation',
    sourceTradition: 'Theravāda, Pali canon',
    sourceTitle: 'Sutta Nipāta',
    sourceReference: 'Sutta Nipāta 1.8, Mettā Sutta',
    sourceUrl: 'https://suttacentral.net/snp1.8/en/sujato',
    contentLabel: 'direct-translation',
    translationNote:
      'Direct translation of the whole poem. The translator’s footnotes are not included.',
    aboutSource:
      'The Mettā Sutta is Sutta Nipāta 1.8, also preserved as Khuddakapāṭha 9. It is an early canonical poem on goodwill. This page gives Bhikkhu Sujato’s full verse translation and leaves out his footnotes. He notes that the final verse is in a different meter and treats it as a later addition; it is included here because it is part of the text he translates. The translation is public domain (CC0), published on SuttaCentral.',
    verified: true,
    blocks: [
      {
        type: 'verse',
        lines: [
          'Those who are skilled in the meaning of scripture',
          'should practice as follows',
          'to realize the state of peace.',
          'Let them be capable and upright, very upright,',
          'easy to speak to, gentle and humble;',
          'content and unburdensome,',
          'unbusied, living lightly,',
          'alert, with senses calmed,',
          'courteous, not fawning on families.',
          'Let them not do the slightest thing',
          'that others who are wise would blame.',
          'May they be happy and safe!',
          'May all beings be happy!',
        ],
      },
      {
        type: 'verse',
        lines: [
          'Whatever living creatures there are',
          'with not a one left out—',
          'frail or firm, long or large,',
          'medium, small, tiny or round,',
          'seen or unseen,',
          'living far or near,',
          'those who have been born',
          'and those about to be born—',
          'may all beings be happy!',
        ],
      },
      {
        type: 'verse',
        lines: [
          'Let none deceive another,',
          'nor look down on anyone anywhere.',
          'Though provoked or aggrieved,',
          'let them not wish pain on each other.',
        ],
      },
      {
        type: 'verse',
        lines: [
          'Even as a mother would protect with her life',
          'her child, her only child,',
          'so too for all creatures',
          'unfold a boundless heart.',
        ],
      },
      {
        type: 'verse',
        lines: [
          'With love for the whole world,',
          'unfold a boundless heart:',
          'above, below, all round,',
          'unconstricted, without enmity or foe.',
        ],
      },
      {
        type: 'verse',
        lines: [
          'When standing, walking, sitting,',
          'or lying down while yet unweary,',
          'keep this ever in mind;',
          'for this, they say, is a divine meditation',
          'in this life.',
        ],
      },
      {
        type: 'verse',
        lines: [
          'Avoiding harmful views,',
          'virtuous, accomplished in insight,',
          'with desire for sensual pleasures dispelled,',
          'they never return to a womb again.',
        ],
      },
      { type: 'paragraph', text: CC0 },
    ],
  }),
  complete({
    id: 'fear-and-dread',
    slug: 'fear-and-dread',
    title: 'Fear and Dread',
    shortDescription:
      'Before his awakening, the Buddha describes staying with fear in frightening forest shrines instead of changing posture to escape it.',
    excerpt:
      'As I was staying there a deer came by, or a peacock snapped a twig, or the wind rustled the leaves.',
    category: 'fear',
    contentType: 'parable',
    sourceTradition: 'Theravāda, Pali canon',
    sourceTitle: 'Majjhima Nikāya',
    sourceReference: 'Majjhima Nikāya 4, Bhayabherava Sutta',
    sourceUrl: 'https://suttacentral.net/mn4/en/sujato',
    contentLabel: 'editorial-summary',
    translationNote:
      'Editorial summary. This is not a verbatim canonical quotation. One passage is quoted from the translation and marked as such.',
    aboutSource:
      'The Bhayabherava Sutta, “Fear and Dread,” is a canonical discourse in the Majjhima Nikāya, not a later commentary tale. It is set at Jeta’s Grove, where the brahmin Jāṇussoṇi talks with the Buddha. Most of this page is an editorial summary. The indented passage is a short quotation from Bhikkhu Sujato’s public-domain translation. The discourse goes on to describe the absorptions and the night of awakening; that later portion is not summarized here.',
    verified: true,
    blocks: [
      {
        type: 'paragraph',
        text: 'The brahmin Jāṇussoṇi tells the Buddha that remote lodgings in the wilderness are hard to bear, and that the forests seem to rob the mind of a mendicant who has not found composure. The Buddha agrees, then speaks about his own practice before awakening.',
      },
      {
        type: 'paragraph',
        text: 'He says he looked at a long list of defects — unpurified conduct of body, speech, and mind, ill will, doubt, laziness, and others — and that those defects are what call up unskillful fear. Where he found his conduct and mind clear, staying in the forest became less unsettled. He then chose nights regarded as portentous in the lunar fortnight, the eighth, fourteenth, and fifteenth, and stayed in frightening shrines in parks, forests, and trees, so that the fear would show itself.',
      },
      {
        type: 'quote',
        text: 'As I was staying there a deer came by, or a peacock snapped a twig, or the wind rustled the leaves. Then I thought, ‘Is this that fear and dread coming?’ Then I thought, ‘Why do I always meditate expecting that fear to come? Why don’t I get rid of that fear and dread just as it comes, while remaining just as I am?’ Then that fear and dread came upon me as I was walking. I didn’t stand still or sit down or lie down until I had got rid of that fear and dread while walking.',
        caption: 'Bhikkhu Sujato’s translation of Majjhima Nikāya 4. Public domain (CC0).',
      },
      {
        type: 'paragraph',
        text: 'He describes the same discipline for standing, for sitting, and for lying down: he remained in the posture he was already in until the fear had gone. The sutta continues well beyond this episode. This page does not retell that continuation.',
      },
    ],
  }),
  complete({
    id: 'simile-of-the-saw',
    slug: 'simile-of-the-saw',
    title: 'The Simile of the Saw',
    shortDescription:
      'A monk’s anger when his friends are criticized becomes the occasion for a discourse on patience, ending with the simile of the saw.',
    excerpt:
      'Even if low-down bandits were to sever you limb from limb with a two-handed saw, anyone who had a malevolent thought on that account would not be following my instructions.',
    category: 'anger',
    contentType: 'parable',
    sourceTradition: 'Theravāda, Pali canon',
    sourceTitle: 'Majjhima Nikāya',
    sourceReference: 'Majjhima Nikāya 21, Kakacūpama Sutta',
    sourceUrl: 'https://suttacentral.net/mn21/en/sujato',
    contentLabel: 'editorial-summary',
    translationNote:
      'Editorial summary. This is not a verbatim canonical quotation. The closing instruction is quoted from the translation and marked as such.',
    aboutSource:
      'The Kakacūpama Sutta, “The Simile of the Saw,” is Majjhima Nikāya 21, a canonical discourse set at Jeta’s Grove. The narrative frame concerns the monk Phagguna of the Top-Knot (Moḷiyaphagguna). This page summarizes that frame and the lead-in to the final simile, then quotes the closing instruction in Bhikkhu Sujato’s public-domain translation. The translator notes that the training not to give way to anger is not an instruction to refuse defense of people who are being harmed. Several similes that come before the saw — the earth, space, the Ganges, and a softened hide — are only mentioned, not quoted.',
    verified: true,
    blocks: [
      {
        type: 'paragraph',
        text: 'At Jeta’s Grove, the monk Phagguna of the Top-Knot had become closely involved with a group of nuns. If another mendicant criticized those nuns in front of him, Phagguna got angry and upset, and even started a disciplinary case. If someone criticized Phagguna in front of the nuns, they did the same.',
      },
      {
        type: 'paragraph',
        text: 'The Buddha sent for him. Phagguna agreed that this was what had been happening. The Buddha told him that, having gone forth out of faith, it was not appropriate to be entangled in that way. If the nuns were criticized in his presence, or even struck, and if he himself was criticized or struck, he should train so that his mind would not degenerate, he would not blurt out bad words, and he would remain sympathetic, with a heart of love and no secret hate.',
      },
      {
        type: 'paragraph',
        text: 'Speaking then to the mendicants, the Buddha described five kinds of critical speech: timely or untimely, true or false, gentle or harsh, beneficial or harmful, and spoken from love or from secret hate. Through a run of similes he compared a trained mind to the great earth, to open space, to the Ganges, and to a hide rubbed until it no longer crackles. The discourse ends with the image that names it.',
      },
      {
        type: 'quote',
        text: 'Even if low-down bandits were to sever you limb from limb with a two-handed saw, anyone who had a malevolent thought on that account would not be following my instructions. If that happens, you should train like this: ‘Our minds will not degenerate. We will blurt out no bad words. We will remain full of sympathy, with a heart of love and no secret hate. We will meditate spreading a heart of love to that individual. And with them as a basis, we will meditate spreading a heart full of love to everyone in the world—abundant, expansive, limitless, free of enmity and ill will.’ That’s how you should train.\n\nIf you frequently reflect on this advice on the simile of the saw, do you see any criticism, large or small, that you could not endure?\n\nSo, mendicants, you should frequently reflect on this advice on the simile of the saw. This will be for your lasting welfare and happiness.',
        caption:
          'Bhikkhu Sujato’s translation of the closing passage of Majjhima Nikāya 21. The monks’ reply, “No, sir,” falls between the two questions and is omitted here. Public domain (CC0).',
      },
    ],
  }),
  complete({
    id: 'one-fine-night',
    slug: 'one-fine-night',
    title: 'One Fine Night',
    shortDescription:
      'A short recital on not running back to the past or leaning into the future, with the canon’s own explanation of the first line.',
    excerpt: 'Don’t run back to the past, don’t anticipate the future.',
    category: 'everyday',
    contentType: 'wisdom',
    sourceTradition: 'Theravāda, Pali canon',
    sourceTitle: 'Majjhima Nikāya',
    sourceReference: 'Majjhima Nikāya 131, Bhaddekaratta Sutta',
    sourceUrl: 'https://suttacentral.net/mn131/en/sujato',
    contentLabel: 'direct-translation',
    translationNote:
      'Direct translation of an excerpt. The summary verse continues, and the discourse explains each line. Only the opening and one explanation are included here.',
    aboutSource:
      'Bhikkhu Sujato titles this discourse “One Fine Night.” It is Majjhima Nikāya 131, the Bhaddekaratta Sutta, a canonical text. It opens with a summary recital and then explains the lines. This page quotes only the beginning of the recital and the explanation of what it means to run back to the past. The ellipsis in the explanation is the translation’s abbreviation of a repeated list. The rest of the sutta is on SuttaCentral. The translation is public domain (CC0).',
    verified: true,
    blocks: [
      {
        type: 'verse',
        lines: [
          'Don’t run back to the past,',
          'don’t anticipate the future.',
          'What’s past is left behind,',
          'the future has not arrived;',
        ],
      },
      {
        type: 'paragraph',
        text: 'The verse continues after this semicolon. What follows is the discourse’s explanation of the first line, in the same translation.',
      },
      {
        type: 'quote',
        text: 'And how do you run back to the past? You muster delight there, thinking: ‘I had such form in the past.’ … ‘I had such feeling … perception … choice … consciousness in the past.’ That’s how you run back to the past.',
        caption: 'Bhikkhu Sujato’s translation of Majjhima Nikāya 131. Public domain (CC0).',
      },
    ],
  }),
];

const slugs = new Set<string>();
for (const story of stories) {
  if (slugs.has(story.slug) || slugs.has(story.id)) {
    throw new Error(`Duplicate story id or slug: ${story.slug}`);
  }
  slugs.add(story.slug);
  slugs.add(story.id);
}

const searchIndex = new Map<string, string>(
  stories.map((story) => {
    const blob = normalizeSearch(
      [
        story.title.en,
        story.title.uk,
        story.shortDescription.en,
        story.shortDescription.uk,
        story.excerpt.en,
        story.excerpt.uk,
        story.translationNote.en,
        story.translationNote.uk,
        story.aboutSource.en,
        story.aboutSource.uk,
        story.sourceTitle.en,
        story.sourceTitle.uk,
        story.sourceReference.en,
        story.sourceReference.uk,
        story.sourceTradition.en,
        story.sourceTradition.uk,
        topicById(story.category).label.en,
        topicById(story.category).label.uk,
        kindTextForSearch(story.contentType),
        blocksToPlain(story.blocks, 'en'),
        blocksToPlain(story.blocks, 'uk'),
      ].join(' '),
    );
    return [story.id, blob];
  }),
);

function kindTextForSearch(kind: ContentKind): string {
  if (kind === 'parable') return 'parable parables притча притчі';
  if (kind === 'meditation') return 'meditation meditations медитація медитації';
  return 'wisdom sacred book books мудрість священна книга';
}

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug);
}

export function storyOfTheDay(date = new Date()): Story {
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const start = Date.UTC(date.getFullYear(), 0, 1);
  const index = Math.floor((today - start) / 86_400_000);
  return stories[(index + stories.length) % stories.length];
}

export function recommendedStories(featuredId: string, count = 3): Story[] {
  const start = Math.max(0, stories.findIndex((story) => story.id === featuredId));
  const picked: Story[] = [];
  for (let step = 1; picked.length < count && step <= stories.length; step += 1) {
    const story = stories[(start + step) % stories.length];
    if (story.id !== featuredId) picked.push(story);
  }
  return picked;
}

export function storiesForTopic(topic: TopicId): Story[] {
  return stories.filter((story) => story.category === topic);
}

export function otherStoriesInTopic(story: Story): Story[] {
  return stories.filter((item) => item.category === story.category && item.id !== story.id);
}

export function adjacentStories(story: Story): { previous: Story | null; next: Story | null } {
  const index = stories.findIndex((item) => item.id === story.id);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: stories[index - 1] ?? null,
    next: stories[index + 1] ?? null,
  };
}

export function filterStories(
  list: Story[],
  options: { q: string; topic: TopicId | 'all'; kind: ContentKind | 'all' },
): Story[] {
  const needle = normalizeSearch(options.q);
  return list.filter((story) => {
    if (options.topic !== 'all' && story.category !== options.topic) return false;
    if (options.kind !== 'all' && story.contentType !== options.kind) return false;
    if (!needle) return true;
    return (searchIndex.get(story.id) ?? '').includes(needle);
  });
}
