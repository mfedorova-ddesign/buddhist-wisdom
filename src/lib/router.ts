import { useSyncExternalStore } from 'react';
import { isTopicId } from '../data/topics';
import { CONTENT_KINDS, type ContentKind, type TopicId } from '../types';

const EVENT = 'stillness:nav';

export type Route =
  | { view: 'home' }
  | { view: 'library'; topic: TopicId | 'all'; kind: ContentKind | 'all'; q: string; saved: boolean }
  | { view: 'story'; slug: string };

let cachedKey = '';
let cachedRoute: Route = { view: 'home' };

function isKind(value: string | null): value is ContentKind {
  return value !== null && (CONTENT_KINDS as readonly string[]).includes(value);
}

export function parseRoute(pathAndQuery: string): Route {
  const url = new URL(pathAndQuery, 'http://localhost');
  const segments = url.pathname.split('/').filter(Boolean);

  if (segments[0] === 'library') {
    const topic = url.searchParams.get('topic');
    const kind = url.searchParams.get('type');
    return {
      view: 'library',
      topic: isTopicId(topic) ? topic : 'all',
      kind: isKind(kind) ? kind : 'all',
      q: url.searchParams.get('q') ?? '',
      saved: url.searchParams.get('saved') === '1',
    };
  }

  if (segments[0] === 'story' && segments[1]) {
    return { view: 'story', slug: decodeURIComponent(segments[1]) };
  }

  return { view: 'home' };
}

function locationKey(): string {
  return window.location.pathname + window.location.search;
}

export function getSnapshot(): Route {
  const key = locationKey();
  if (key !== cachedKey) {
    cachedKey = key;
    cachedRoute = parseRoute(key);
  }
  return cachedRoute;
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener('popstate', onStoreChange);
  window.addEventListener(EVENT, onStoreChange);
  return () => {
    window.removeEventListener('popstate', onStoreChange);
    window.removeEventListener(EVENT, onStoreChange);
  };
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, getSnapshot, () => cachedRoute);
}

export function navigate(to: string, mode: 'push' | 'replace' = 'push'): void {
  if (locationKey() === to) return;
  const method = mode === 'push' ? 'pushState' : 'replaceState';
  window.history[method](null, '', to);
  window.dispatchEvent(new Event(EVENT));
}

export function libraryHref(options: {
  topic?: TopicId | 'all';
  kind?: ContentKind | 'all';
  q?: string;
  saved?: boolean;
}): string {
  const params = new URLSearchParams();
  if (options.topic && options.topic !== 'all') params.set('topic', options.topic);
  if (options.kind && options.kind !== 'all') params.set('type', options.kind);
  if (options.saved) params.set('saved', '1');
  const query = options.q?.trim();
  if (query) params.set('q', query);
  const search = params.toString();
  return search ? `/library?${search}` : '/library';
}

export function storyHref(slug: string): string {
  return `/story/${encodeURIComponent(slug)}`;
}

export function onAppLinkClick(event: { preventDefault(): void; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; button: number; currentTarget: EventTarget & { getAttribute(name: string): string | null } }): void {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const href = event.currentTarget.getAttribute('href');
  if (!href || href.startsWith('http')) return;
  event.preventDefault();
  navigate(href);
}
