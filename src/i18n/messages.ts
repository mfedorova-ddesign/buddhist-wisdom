import type { ContentKind, ContentLabel, Locale } from '../types';

export interface Messages {
  brandNote: string;
  home: string;
  library: string;
  menu: string;
  closeMenu: string;
  skip: string;
  readingCollection: string;
  headline: string;
  intro: string;
  pathToday: string;
  pathLibrary: string;
  pathTopics: string;
  storyOfDay: string;
  fiveTopics: string;
  topicsIntro: string;
  howToRead: string;
  kindBody: Record<ContentKind, string>;
  openLibrary: string;
  exploreLibrary: string;
  libraryIntro: string;
  search: string;
  searchPlaceholder: string;
  topic: string;
  allTopics: string;
  contentType: string;
  all: string;
  saved: string;
  reset: string;
  nothingSaved: string;
  nothingSavedHint: string;
  noMatch: string;
  noMatchHint: string;
  save: string;
  savedState: string;
  listen: string;
  readStory: string;
  play: string;
  pause: string;
  stop: string;
  readingAloud: string;
  paused: string;
  finished: string;
  ready: string;
  elapsed: string;
  source: string;
  text: string;
  reference: string;
  tradition: string;
  readSource: string;
  noSourceLink: string;
  aboutSource: string;
  moreIn: string;
  allInTopic: string;
  previous: string;
  next: string;
  notFoundTitle: string;
  notFoundBody: string;
  goLibrary: string;
  notFoundDoc: string;
  libraryDoc: string;
  playerNote: string;
  playerFileNote: string;
  voiceNamed: string;
  noEnglishVoice: string;
  noUkrainianVoice: string;
  speechUnsupported: string;
  errBlocked: string;
  errStopped: string;
  errFile: string;
  errFileBlocked: string;
  seek: string;
  progress: string;
  mainNav: string;
  filters: string;
  topics: string;
  sources: string;
  footerNote: string;
  sourcesBody: string;
  licensing: string;
  newTab: string;
  unverified: string;
  breadcrumb: string;
  adjacent: string;
  elapsedLabel: string;
  durationLabel: string;
  label: Record<ContentLabel, string>;
  kind: Record<ContentKind, string>;
  kindPlural: Record<ContentKind, string>;
}

const en: Messages = {
  brandNote: 'Buddhist wisdom stories',
  home: 'Home',
  library: 'Library',
  menu: 'Menu',
  closeMenu: 'Close',
  skip: 'Skip to content',
  readingCollection: 'A reading collection',
  headline: 'Wisdom to return to',
  intro:
    'Discover timeless Buddhist parables, passages from the sacred books, and meditations. Read slowly, listen quietly, and explore the wisdom behind each text.',
  pathToday: 'Today’s text',
  pathLibrary: 'The full library',
  pathTopics: 'Five topics',
  storyOfDay: 'Story of the day',
  fiveTopics: 'Five topics',
  topicsIntro: 'The collection is grouped by the question a text is answering. Open a topic to keep only those texts.',
  howToRead: 'How to read an entry',
  kindBody: {
    parable:
      'Narrative episodes and similes from the discourses. These pages are summaries unless a passage is marked as a quotation. They are not later folk tales.',
    wisdom:
      'Short passages from the canonical books. When the label says direct translation, that is the translator’s wording.',
    meditation:
      'Canonical instructions for practice. This is not a newly written guided script.',
  },
  openLibrary: 'Open the library',
  exploreLibrary: 'Explore the library',
  libraryIntro: 'Search by title or wording, or narrow by topic and kind of text.',
  search: 'Search',
  searchPlaceholder: 'Title or words',
  topic: 'Topic',
  allTopics: 'All topics',
  contentType: 'Content type',
  all: 'All',
  saved: 'Saved',
  reset: 'Reset',
  nothingSaved: 'Nothing saved yet.',
  nothingSavedHint: 'Use Save story and the text will appear here on this device.',
  noMatch: 'Nothing matches.',
  noMatchHint: 'Try another title, phrase, or topic.',
  save: 'Save story',
  savedState: 'Saved',
  listen: 'Listen',
  readStory: 'Read story',
  play: 'Play',
  pause: 'Pause',
  stop: 'Stop',
  readingAloud: 'Reading aloud',
  paused: 'Paused',
  finished: 'Finished',
  ready: 'Ready',
  elapsed: 'elapsed',
  source: 'Source',
  text: 'Text',
  reference: 'Reference',
  tradition: 'Tradition',
  readSource: 'Read on SuttaCentral',
  noSourceLink: 'No source link for this entry.',
  aboutSource: 'About the source',
  moreIn: 'More in',
  allInTopic: 'All in this topic',
  previous: 'Previous',
  next: 'Next',
  notFoundTitle: 'This text is not in the library',
  notFoundBody: 'The link may be out of date, or the address was typed by hand.',
  goLibrary: 'Go to the library',
  notFoundDoc: 'Not found',
  libraryDoc: 'Library',
  playerNote: 'The browser reads the text aloud. This is generated speech, not a recording.',
  playerFileNote: 'Recorded narration.',
  voiceNamed: 'Voice',
  noEnglishVoice: 'Default browser voice. No English voice was found.',
  noUkrainianVoice: 'No Ukrainian voice was found. The browser will use its default voice.',
  speechUnsupported: 'This browser cannot read aloud. The text is still here to read.',
  errBlocked: 'The browser blocked playback.',
  errStopped: 'Reading stopped unexpectedly.',
  errFile: 'The recording could not be played.',
  errFileBlocked: 'The browser blocked playback of the recording.',
  seek: 'Seek',
  progress: 'Reading progress',
  mainNav: 'Main',
  filters: 'Filters',
  topics: 'Topics',
  sources: 'Sources',
  footerNote:
    'A reading prototype. Verses marked as direct translations are short excerpts from Bhikkhu Sujato’s public-domain English. Ukrainian wording is an editorial rendering of that English, not a checked Ukrainian edition of the Pali.',
  sourcesBody:
    'Texts are from the Pali canon and are identified by collection and number. Translations by Bhikkhu Sujato are published on SuttaCentral and dedicated to the public domain (CC0). The links open the English pages.',
  licensing: 'Licensing',
  newTab: '(opens in a new tab)',
  unverified: 'This entry needs editorial verification. It is not presented as an authenticated Buddhist text.',
  breadcrumb: 'Breadcrumb',
  adjacent: 'Adjacent texts',
  elapsedLabel: 'Elapsed',
  durationLabel: 'Duration',
  label: {
    'direct-translation': 'Direct translation',
    retelling: 'Retelling',
    'editorial-summary': 'Editorial summary',
  },
  kind: { parable: 'Parable', wisdom: 'Sacred book', meditation: 'Meditation' },
  kindPlural: { parable: 'Parables', wisdom: 'Wisdom from the books', meditation: 'Meditations' },
};

const uk: Messages = {
  brandNote: 'Буддійські історії мудрості',
  home: 'Головна',
  library: 'Бібліотека',
  menu: 'Меню',
  closeMenu: 'Закрити',
  skip: 'До вмісту',
  readingCollection: 'Збірка для читання',
  headline: 'Мудрість, до якої повертаються',
  intro:
    'Відкрийте буддійські притчі, уривки зі священних книг і медитації. Читайте повільно, слухайте тихо і розбирайте мудрість за кожним текстом.',
  pathToday: 'Текст дня',
  pathLibrary: 'Уся бібліотека',
  pathTopics: 'П’ять тем',
  storyOfDay: 'Історія дня',
  fiveTopics: 'П’ять тем',
  topicsIntro: 'Збірку зібрано за питанням, на яке відповідає текст. Відкрийте тему, щоб лишити лише ці тексти.',
  howToRead: 'Як читати запис',
  kindBody: {
    parable:
      'Оповідні епізоди та порівняння з сутт. Ці сторінки — виклади, якщо уривок окремо не позначено як цитату. Це не пізніші народні казки.',
    wisdom:
      'Короткі уривки з канонічних книг. Якщо позначка каже «прямий переклад», це формулювання перекладача. В українській версії ті самі вірші позначено як переказ.',
    meditation:
      'Канонічні настанови для практики. Це не щойно написаний текст веденої медитації.',
  },
  openLibrary: 'Відкрити бібліотеку',
  exploreLibrary: 'Досліджувати бібліотеку',
  libraryIntro: 'Шукайте за назвою чи словами або звузьте вибір за темою і типом тексту.',
  search: 'Пошук',
  searchPlaceholder: 'Назва або слова',
  topic: 'Тема',
  allTopics: 'Усі теми',
  contentType: 'Тип тексту',
  all: 'Усі',
  saved: 'Збережені',
  reset: 'Скинути',
  nothingSaved: 'Ще нічого не збережено.',
  nothingSavedHint: 'Натисніть «Зберегти», і текст з’явиться тут на цьому пристрої.',
  noMatch: 'Нічого не знайдено.',
  noMatchHint: 'Спробуйте іншу назву, фразу або тему.',
  save: 'Зберегти',
  savedState: 'Збережено',
  listen: 'Слухати',
  readStory: 'Читати',
  play: 'Відтворити',
  pause: 'Пауза',
  stop: 'Зупинити',
  readingAloud: 'Читаємо вголос',
  paused: 'Пауза',
  finished: 'Завершено',
  ready: 'Готово',
  elapsed: 'минуло',
  source: 'Джерело',
  text: 'Текст',
  reference: 'Посилання',
  tradition: 'Традиція',
  readSource: 'Читати на SuttaCentral',
  noSourceLink: 'Для цього запису немає посилання на джерело.',
  aboutSource: 'Про джерело',
  moreIn: 'Ще в темі',
  allInTopic: 'Усе з цієї теми',
  previous: 'Попередній',
  next: 'Наступний',
  notFoundTitle: 'Цього тексту немає в бібліотеці',
  notFoundBody: 'Посилання може бути застарілим, або адресу введено вручну.',
  goLibrary: 'До бібліотеки',
  notFoundDoc: 'Не знайдено',
  libraryDoc: 'Бібліотека',
  playerNote: 'Браузер читає текст уголос. Це синтез мовлення, не запис.',
  playerFileNote: 'Записане читання.',
  voiceNamed: 'Голос',
  noEnglishVoice: 'Типовий голос браузера. Англійський голос не знайдено.',
  noUkrainianVoice: 'Український голос не знайдено. Браузер використає типовий голос.',
  speechUnsupported: 'Цей браузер не вміє читати вголос. Текст можна читати на сторінці.',
  errBlocked: 'Браузер заблокував відтворення.',
  errStopped: 'Читання несподівано зупинилося.',
  errFile: 'Запис не вдалося відтворити.',
  errFileBlocked: 'Браузер заблокував відтворення запису.',
  seek: 'Перемотка',
  progress: 'Хід читання',
  mainNav: 'Основне',
  filters: 'Фільтри',
  topics: 'Теми',
  sources: 'Джерела',
  footerNote:
    'Прототип для читання. Вірші з позначкою прямого перекладу — короткі уривки з англійського перекладу Бгіккгу Суджато, суспільного надбання. Українські формулювання — редакційний переклад того англійського тексту, а не звірене українське видання палійського оригіналу.',
  sourcesBody:
    'Тексти з палійського канону, їх названо за збіркою і номером. Переклади Бгіккгу Суджато опубліковано на SuttaCentral і передано в суспільне надбання (CC0). Посилання відкривають англійські сторінки.',
  licensing: 'Ліцензія',
  newTab: '(відкривається в новій вкладці)',
  unverified: 'Цей запис ще потребує редакційної перевірки. Його не подано як засвідчений буддійський текст.',
  breadcrumb: 'Шлях',
  adjacent: 'Сусідні тексти',
  elapsedLabel: 'Минуло',
  durationLabel: 'Тривалість',
  label: {
    'direct-translation': 'Прямий переклад',
    retelling: 'Переказ',
    'editorial-summary': 'Редакційний виклад',
  },
  kind: { parable: 'Притча', wisdom: 'Священна книга', meditation: 'Медитація' },
  kindPlural: { parable: 'Притчі', wisdom: 'Мудрість зі священних книг', meditation: 'Медитації' },
};

export const messages: Record<Locale, Messages> = { en, uk };

export function countNoun(locale: Locale, count: number, kind: 'text' | ContentKind): string {
  if (locale === 'en') {
    if (kind === 'text') return count === 1 ? 'text' : 'texts';
    if (kind === 'parable') return count === 1 ? 'parable' : 'parables';
    if (kind === 'wisdom') return count === 1 ? 'sacred text' : 'sacred texts';
    return count === 1 ? 'meditation' : 'meditations';
  }
  const n10 = count % 10;
  const n100 = count % 100;
  const form = n10 === 1 && n100 !== 11 ? 0 : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? 1 : 2;
  const forms: Record<'text' | ContentKind, [string, string, string]> = {
    text: ['текст', 'тексти', 'текстів'],
    parable: ['притча', 'притчі', 'притч'],
    wisdom: ['уривок', 'уривки', 'уривків'],
    meditation: ['медитація', 'медитації', 'медитацій'],
  };
  return forms[kind][form];
}

export function describeResults(
  locale: Locale,
  options: {
    count: number;
    saved: boolean;
    kind: ContentKind | 'all';
    topic: string | null;
    query: string;
  },
): string {
  const noun = countNoun(locale, options.count, options.kind === 'all' ? 'text' : options.kind);
  if (locale === 'uk') {
    const bits = [`Показано ${options.count} ${noun}`];
    if (options.saved) bits.push('збережені');
    if (options.topic) bits.push(`тема «${options.topic}»`);
    if (options.query) bits.push(`запит «${options.query}»`);
    return `${bits.join(', ')}.`;
  }
  const saved = options.saved ? 'saved ' : '';
  const where = options.topic ? ` in ${options.topic}` : '';
  const query = options.query ? ` matching “${options.query}”` : '';
  return `Showing ${options.count} ${saved}${noun}${where}${query}.`;
}
