import { useCallback, useEffect, useRef } from 'react';

type Options = {
  beatMs: number;
  beats: number;
  onBeat: (index: number) => void;
};

/**
 * Drift-corrected beat scheduler. Every tick is scheduled against the absolute
 * start timestamp held in a ref (rule #8 — timing data never lives in state),
 * so an accumulating setTimeout drift cannot smear the count-in.
 */
export function useMetronome({ beatMs, beats, onBeat }: Options) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef(0);
  const indexRef = useRef(0);
  const onBeatRef = useRef(onBeat);
  onBeatRef.current = onBeat;
  const beatMsRef = useRef(beatMs);
  beatMsRef.current = beatMs;
  const beatsRef = useRef(beats);
  beatsRef.current = beats;

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = useCallback(() => {
    const next = indexRef.current;
    if (next >= beatsRef.current) {
      stop();
      return;
    }
    const target = startedAtRef.current + next * beatMsRef.current;
    const delay = Math.max(0, target - Date.now());
    timerRef.current = setTimeout(() => {
      onBeatRef.current(next);
      indexRef.current = next + 1;
      schedule();
    }, delay);
  }, [stop]);

  const start = useCallback(() => {
    stop();
    startedAtRef.current = Date.now();
    indexRef.current = 0;
    schedule();
  }, [schedule, stop]);

  useEffect(() => stop, [stop]);

  return { start, stop };
}

export default useMetronome;
