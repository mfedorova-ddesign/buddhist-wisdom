import type { Topic, TopicId } from '../types';

export const TOPICS: Topic[] = [
  {
    id: 'anger',
    label: { en: 'Anger & Patience', uk: 'Гнів і терпіння' },
    description: {
      en: 'Grudge, harsh speech, and the training to meet injury without hatred.',
      uk: 'Образа, різка мова і навчання зустрічати шкоду без ненависті.',
    },
  },
  {
    id: 'attachment',
    label: { en: 'Attachment & Letting Go', uk: 'Прив’язаність і відпускання' },
    description: {
      en: 'Craving, sorrow, and the instruction to release past, future, and present.',
      uk: 'Жадання, смуток і настанова відпустити минуле, майбутнє і теперішнє.',
    },
  },
  {
    id: 'compassion',
    label: { en: 'Compassion', uk: 'Співчуття' },
    description: {
      en: 'A canonical poem on goodwill toward every living being.',
      uk: 'Канонічний вірш про доброзичливість до кожної живої істоти.',
    },
  },
  {
    id: 'fear',
    label: { en: 'Fear & Uncertainty', uk: 'Страх і непевність' },
    description: {
      en: 'A first-person account of meeting fear in the forest before awakening.',
      uk: 'Розповідь від першої особи про зустріч зі страхом у лісі перед пробудженням.',
    },
  },
  {
    id: 'everyday',
    label: { en: 'Everyday Wisdom', uk: 'Мудрість у повсякденні' },
    description: {
      en: 'Short teachings on intention, and on not living in the past or the future.',
      uk: 'Короткі повчання про намір і про те, щоб не жити в минулому чи майбутньому.',
    },
  },
];

const TOPIC_IDS = new Set<string>(TOPICS.map((topic) => topic.id));

export function isTopicId(value: string | null): value is TopicId {
  return value !== null && TOPIC_IDS.has(value);
}

export function topicById(id: TopicId): Topic {
  const topic = TOPICS.find((item) => item.id === id);
  if (!topic) {
    throw new Error(`Unknown topic: ${id}`);
  }
  return topic;
}
