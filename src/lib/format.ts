import type { Block, Locale } from '../types';

export function formatReadingTime(minutes: number, locale: Locale): string {
  return locale === 'uk' ? `${minutes} хв читання` : `${minutes} min read`;
}

export function formatIndex(index: number): string {
  return String(index).padStart(2, '0');
}

export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export function blocksToPlain(blocks: Block[], locale: Locale): string {
  return blocks
    .map((block) => {
      if (block.type === 'verse') return block.lines[locale].join('\n');
      if (block.type === 'quote') return `${block.text[locale]}\n${block.caption[locale]}`;
      return block.text[locale];
    })
    .join('\n\n');
}

export function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
}

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
