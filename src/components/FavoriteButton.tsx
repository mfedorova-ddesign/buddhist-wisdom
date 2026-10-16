import { Heart } from 'lucide-react';
import { useI18n } from '../i18n/locale';
import { useFavorites } from '../lib/favorites';

export function FavoriteButton({ storyId }: { storyId: string }) {
  const { isSaved, toggle } = useFavorites();
  const { m } = useI18n();
  const saved = isSaved(storyId);

  return (
    <button
      type="button"
      className={saved ? 'favorite is-saved' : 'favorite'}
      aria-pressed={saved}
      onClick={() => toggle(storyId)}
    >
      <Heart size={16} strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
      <span>{saved ? m.savedState : m.save}</span>
    </button>
  );
}
