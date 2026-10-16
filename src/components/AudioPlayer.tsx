import { Pause, Play, Square } from 'lucide-react';
import { useI18n } from '../i18n/locale';
import { formatClock } from '../lib/format';
import { useNarration, type NarrationErrorCode } from '../lib/narration';
import type { Story } from '../types';

export function AudioPlayer({ story }: { story: Story }) {
  const { supported, session, elapsed, progress, error, voiceName, missingVoice, play, pause, resume, stop, seek } =
    useNarration();
  const { locale, m } = useI18n();
  const active = session?.storyId === story.id ? session : null;
  const status = active?.status ?? 'idle';
  const fileDuration = active?.mode === 'file' ? active.duration : null;

  const statusText =
    status === 'speaking' ? m.readingAloud : status === 'paused' ? m.paused : status === 'finished' ? m.finished : m.ready;

  const errorText: Record<NarrationErrorCode, string> = {
    blocked: m.errBlocked,
    stopped: m.errStopped,
    file: m.errFile,
    'file-blocked': m.errFileBlocked,
  };

  const onPrimary = () => {
    if (status === 'speaking') {
      pause();
      return;
    }
    if (status === 'paused') {
      resume();
      return;
    }
    play(story);
  };

  const note = !supported
    ? m.speechUnsupported
    : story.narration.type === 'file'
      ? m.playerFileNote
      : m.playerNote;

  return (
    <section className="player" id="listen" aria-labelledby="listen-heading">
      <div className="player-head">
        <h2 id="listen-heading">{m.listen}</h2>
        <p className="player-status" aria-live="polite">
          {statusText}
        </p>
      </div>

      <p id="player-note" className="player-note">
        {note}
      </p>
      {supported && voiceName ? (
        <p className="player-voice">
          {m.voiceNamed}: {voiceName}
        </p>
      ) : null}
      {supported && missingVoice ? (
        <p className="player-voice">{locale === 'uk' ? m.noUkrainianVoice : m.noEnglishVoice}</p>
      ) : null}
      {error ? <p className="player-error">{errorText[error]}</p> : null}

      <div className="player-controls">
        <button
          type="button"
          className="button"
          onClick={onPrimary}
          disabled={!supported && story.narration.type === 'speech'}
          aria-describedby="player-note"
        >
          {status === 'speaking' ? (
            <Pause size={16} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Play size={16} strokeWidth={1.5} aria-hidden="true" />
          )}
          {status === 'speaking' ? m.pause : m.play}
        </button>
        <button type="button" className="button secondary" onClick={stop} disabled={!active || status === 'idle'}>
          <Square size={14} strokeWidth={1.5} aria-hidden="true" />
          {m.stop}
        </button>
        {active && (active.duration != null || elapsed > 0 || status === 'speaking' || status === 'paused') ? (
          <p className="player-time">
            {active.duration != null ? (
              <>
                <span className="sr-only">{m.elapsedLabel} </span>
                {formatClock(elapsed)}
                <span aria-hidden="true"> / </span>
                <span className="sr-only"> {m.durationLabel} </span>
                {formatClock(active.duration)}
              </>
            ) : (
              <>
                {formatClock(elapsed)} <span>{m.elapsed}</span>
              </>
            )}
          </p>
        ) : null}
      </div>

      {fileDuration != null && fileDuration > 0 ? (
        <label className="seek">
          <span className="sr-only">{m.seek}</span>
          <input
            type="range"
            min={0}
            max={fileDuration}
            step={0.1}
            value={Math.min(elapsed, fileDuration)}
            onChange={(event) => seek(Number(event.target.value))}
          />
        </label>
      ) : null}

      {fileDuration == null && progress != null && active ? (
        <div
          className="progress"
          role="progressbar"
          aria-label={m.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </section>
  );
}
