import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useI18n } from '../i18n/locale';
import type { Locale, Story } from '../types';

export type PlaybackStatus = 'idle' | 'speaking' | 'paused' | 'finished';
export type NarrationErrorCode = 'blocked' | 'stopped' | 'file' | 'file-blocked';

interface Session {
  storyId: string;
  mode: 'speech' | 'file';
  status: Exclude<PlaybackStatus, 'idle'>;
  duration: number | null;
}

interface NarrationContextValue {
  supported: boolean;
  session: Session | null;
  elapsed: number;
  progress: number | null;
  error: NarrationErrorCode | null;
  voiceName: string | null;
  missingVoice: boolean;
  play: (story: Story) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
}

const NarrationContext = createContext<NarrationContextValue | null>(null);

function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function chooseVoice(voices: SpeechSynthesisVoice[], locale: Locale): SpeechSynthesisVoice | undefined {
  const score = (voice: SpeechSynthesisVoice) => {
    const lang = voice.lang.toLowerCase().replace('_', '-');
    let value = 10;
    if (locale === 'uk') {
      if (lang === 'uk-ua') value = 0;
      else if (lang.startsWith('uk')) value = 1;
      else return 100;
    } else if (lang === 'en-us') value = 0;
    else if (lang.startsWith('en-us')) value = 1;
    else if (lang === 'en-gb') value = 2;
    else if (lang.startsWith('en-gb')) value = 3;
    else if (lang.startsWith('en')) value = 4;
    else return 100;
    if (voice.localService) value -= 0.25;
    return value;
  };

  return voices
    .filter((voice) => score(voice) < 100)
    .sort((a, b) => score(a) - score(b))[0];
}

export function NarrationProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const localeRef = useRef(locale);
  const supported = speechSupported();
  const [session, setSession] = useState<Session | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<NarrationErrorCode | null>(null);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [missingVoice, setMissingVoice] = useState(false);

  const tokenRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const elapsedBaseRef = useRef(0);
  const speakingSinceRef = useRef<number | null>(null);
  const sessionRef = useRef<Session | null>(null);
  sessionRef.current = session;

  const currentElapsed = () => {
    const running = speakingSinceRef.current == null ? 0 : performance.now() - speakingSinceRef.current;
    return (elapsedBaseRef.current + running) / 1000;
  };

  const freezeElapsed = () => {
    if (speakingSinceRef.current != null) {
      elapsedBaseRef.current += performance.now() - speakingSinceRef.current;
      speakingSinceRef.current = null;
    }
    setElapsed(elapsedBaseRef.current / 1000);
  };

  const stop = () => {
    tokenRef.current += 1;
    utteranceRef.current = null;
    window.speechSynthesis?.cancel();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    elapsedBaseRef.current = 0;
    speakingSinceRef.current = null;
    setSession(null);
    setElapsed(0);
    setProgress(null);
    setError(null);
  };

  const stopRef = useRef(stop);
  stopRef.current = stop;

  useEffect(() => {
    if (localeRef.current === locale) return;
    localeRef.current = locale;
    if (sessionRef.current) stopRef.current();
  }, [locale]);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const warm = () => {
      const voice = chooseVoice(synth.getVoices(), locale);
      if (voice) {
        setVoiceName(voice.name);
        setMissingVoice(false);
      } else if (synth.getVoices().length > 0) {
        setVoiceName(null);
        setMissingVoice(true);
      }
    };
    warm();
    synth.addEventListener('voiceschanged', warm);
    return () => synth.removeEventListener('voiceschanged', warm);
  }, [supported, locale]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    let last = `${window.location.pathname}${window.location.search}`;
    const onNavigate = () => {
      const next = `${window.location.pathname}${window.location.search}`;
      if (next !== last) {
        const leftStory = !next.startsWith('/story/') || (last.startsWith('/story/') && next !== last);
        if (leftStory && sessionRef.current) stopRef.current();
        last = next;
      }
    };
    window.addEventListener('popstate', onNavigate);
    window.addEventListener('stillness:nav', onNavigate);
    return () => {
      window.removeEventListener('popstate', onNavigate);
      window.removeEventListener('stillness:nav', onNavigate);
    };
  }, []);

  useEffect(() => {
    if (session?.status !== 'speaking' || session.mode !== 'speech') return;
    const id = window.setInterval(() => setElapsed(currentElapsed()), 250);
    return () => window.clearInterval(id);
  }, [session?.status, session?.mode]);

  useEffect(() => {
    if (!supported || session?.mode !== 'speech' || session.status !== 'speaking') return;
    // Chrome stops speechSynthesis after roughly fifteen seconds unless it is nudged.
    const id = window.setInterval(() => {
      const synth = window.speechSynthesis;
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 10_000);
    return () => window.clearInterval(id);
  }, [supported, session?.mode, session?.status]);

  const playSpeech = (story: Story) => {
    if (!supported) {
      setSession(null);
      return;
    }

    const token = ++tokenRef.current;
    window.speechSynthesis.cancel();
    elapsedBaseRef.current = 0;
    speakingSinceRef.current = null;
    setElapsed(0);
    setProgress(null);
    setError(null);

    const spokenText = story.audioText[localeRef.current];
    const utterance = new SpeechSynthesisUtterance(spokenText);
    const voice = chooseVoice(window.speechSynthesis.getVoices(), localeRef.current);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      setVoiceName(voice.name);
      setMissingVoice(false);
    } else {
      utterance.lang = localeRef.current === 'uk' ? 'uk-UA' : 'en-US';
      setVoiceName(null);
      setMissingVoice(true);
    }

    utterance.onboundary = (event) => {
      if (tokenRef.current !== token) return;
      if (!spokenText.length) return;
      const spoken = event.charIndex + (event.charLength ?? 0);
      setProgress(Math.min(100, (spoken / spokenText.length) * 100));
    };

    utterance.onend = () => {
      if (tokenRef.current !== token) return;
      freezeElapsed();
      setProgress(100);
      setSession((current) => (current && current.storyId === story.id ? { ...current, status: 'finished' } : current));
    };

    utterance.onerror = (event) => {
      if (tokenRef.current !== token) return;
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      freezeElapsed();
      setSession(null);
      setError(event.error === 'not-allowed' ? 'blocked' : 'stopped');
    };

    utteranceRef.current = utterance;
    speakingSinceRef.current = performance.now();
    setSession({ storyId: story.id, mode: 'speech', status: 'speaking', duration: null });

    window.setTimeout(() => {
      if (tokenRef.current !== token) return;
      window.speechSynthesis.speak(utterance);
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    }, 0);
  };

  const playFile = (story: Story, src: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    const token = ++tokenRef.current;
    window.speechSynthesis?.cancel();
    setError(null);
    setProgress(0);
    setElapsed(0);
    elapsedBaseRef.current = 0;
    speakingSinceRef.current = null;

    const onTime = () => {
      if (tokenRef.current !== token) return;
      setElapsed(audio.currentTime);
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onMeta = () => {
      if (tokenRef.current !== token) return;
      const duration = Number.isFinite(audio.duration) ? audio.duration : null;
      setSession({ storyId: story.id, mode: 'file', status: 'speaking', duration });
    };
    const onEnd = () => {
      if (tokenRef.current !== token) return;
      setProgress(100);
      setElapsed(audio.duration || 0);
      setSession((current) => (current ? { ...current, status: 'finished' } : current));
    };
    const onAudioError = () => {
      if (tokenRef.current !== token) return;
      setSession(null);
      setError('file');
    };

    audio.onloadedmetadata = onMeta;
    audio.ontimeupdate = onTime;
    audio.onended = onEnd;
    audio.onerror = onAudioError;
    audio.src = src;
    setSession({ storyId: story.id, mode: 'file', status: 'speaking', duration: null });
    void audio.play().catch(() => {
      if (tokenRef.current !== token) return;
      setSession(null);
      setError('file-blocked');
    });
  };

  const play = (story: Story) => {
    if (story.narration.type === 'file') playFile(story, story.narration.src);
    else playSpeech(story);
  };

  const pause = () => {
    const current = sessionRef.current;
    if (!current || current.status !== 'speaking') return;
    if (current.mode === 'speech') {
      window.speechSynthesis.pause();
      freezeElapsed();
    } else {
      audioRef.current?.pause();
    }
    setSession({ ...current, status: 'paused' });
  };

  const resume = () => {
    const current = sessionRef.current;
    if (!current || current.status !== 'paused') return;
    if (current.mode === 'speech') {
      speakingSinceRef.current = performance.now();
      window.speechSynthesis.resume();
    } else {
      void audioRef.current?.play();
    }
    setSession({ ...current, status: 'speaking' });
  };

  const seek = (seconds: number) => {
    const current = sessionRef.current;
    const audio = audioRef.current;
    if (!current || current.mode !== 'file' || !audio) return;
    audio.currentTime = seconds;
    setElapsed(seconds);
    if (current.duration && current.duration > 0) {
      setProgress((seconds / current.duration) * 100);
    }
  };

  const value = useMemo<NarrationContextValue>(
    () => ({ supported, session, elapsed, progress, error, voiceName, missingVoice, play, pause, resume, stop, seek }),
    [supported, session, elapsed, progress, error, voiceName, missingVoice],
  );

  return <NarrationContext.Provider value={value}>{children}</NarrationContext.Provider>;
}

export function useNarration(): NarrationContextValue {
  const value = useContext(NarrationContext);
  if (!value) throw new Error('useNarration must be used within NarrationProvider');
  return value;
}
