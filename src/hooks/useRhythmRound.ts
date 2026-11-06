import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { NEAR_TOLERANCE_MS } from '../constants/config';
import { Bar } from '../game/rhythm';
import { Judgement, judge, RoundResult, summarise, Verdict } from '../game/scoring';

export type RoundPhase = 'idle' | 'countin' | 'playing' | 'done';

type Options = {
  bar: Bar;
  latencyMs: number;
  onBeat: (index: number) => void;
  onNoteJudged: () => void;
  onFinish: (result: RoundResult) => void;
};

const SETTLE_MS = 400;

/**
 * Owns one bar of practice: the count-in, the playhead progress value, the
 * judgement of every tap and the end-of-bar result. All time-critical data
 * lives in refs so callbacks never read stale state (rule #8).
 */
export function useRhythmRound({
  bar,
  latencyMs,
  onBeat,
  onNoteJudged,
  onFinish,
}: Options) {
  const progress = useRef(new Animated.Value(0)).current;
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startedAtRef = useRef(0);
  const judgementsRef = useRef<(Judgement | null)[]>([]);
  const nonceRef = useRef(0);

  const [phase, setPhase] = useState<RoundPhase>('idle');
  const [countIndex, setCountIndex] = useState(-1);
  const [judgements, setJudgements] = useState<(Judgement | null)[]>([]);
  const [verdict, setVerdict] = useState<{ value: Verdict | null; nonce: number }>({
    value: null,
    nonce: 0,
  });

  const barRef = useRef(bar);
  barRef.current = bar;
  const latencyRef = useRef(latencyMs);
  latencyRef.current = latencyMs;
  const onBeatRef = useRef(onBeat);
  onBeatRef.current = onBeat;
  const onNoteJudgedRef = useRef(onNoteJudged);
  onNoteJudgedRef.current = onNoteJudged;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    timersRef.current.push(setTimeout(fn, delay));
  }, []);

  const publish = useCallback(() => {
    setJudgements(judgementsRef.current.slice());
  }, []);

  const finish = useCallback(() => {
    setPhase('done');
    onFinishRef.current(summarise(barRef.current.level.id, judgementsRef.current));
  }, []);

  const beginPlay = useCallback(() => {
    const current = barRef.current;
    startedAtRef.current = Date.now();
    setPhase('playing');
    setCountIndex(-1);

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: current.barMs,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    for (let b = 0; b < current.level.beats; b += 1) {
      const index = b;
      addTimer(() => onBeatRef.current(index), b * current.beatMs);
    }

    current.onsets.forEach((onset, index) => {
      addTimer(() => {
        if (!judgementsRef.current[index]) {
          judgementsRef.current[index] = {
            noteIndex: index,
            verdict: 'miss',
            errMs: NEAR_TOLERANCE_MS,
          };
          publish();
        }
      }, onset + NEAR_TOLERANCE_MS + latencyRef.current);
    });

    addTimer(finish, current.barMs + SETTLE_MS);
  }, [addTimer, finish, progress, publish]);

  const start = useCallback(() => {
    clearTimers();
    const current = barRef.current;
    judgementsRef.current = current.onsets.map(() => null);
    nonceRef.current = 0;
    setJudgements(judgementsRef.current.slice());
    setVerdict({ value: null, nonce: 0 });
    setPhase('countin');
    setCountIndex(0);
    progress.setValue(0);

    for (let b = 0; b < current.level.beats; b += 1) {
      const index = b;
      addTimer(() => {
        setCountIndex(index);
        onBeatRef.current(index);
      }, b * current.beatMs);
    }
    addTimer(beginPlay, current.level.beats * current.beatMs);
  }, [addTimer, beginPlay, clearTimers, progress]);

  const stop = useCallback(() => {
    clearTimers();
    progress.stopAnimation();
    setPhase('idle');
    setCountIndex(-1);
  }, [clearTimers, progress]);

  /** Called from the tap pad. Judges against the nearest unjudged note. */
  const registerTap = useCallback(() => {
    if (phase !== 'playing') {
      return;
    }
    const current = barRef.current;
    const now = Date.now() - startedAtRef.current - latencyRef.current;

    let bestIndex = -1;
    let bestErr = 0;
    current.onsets.forEach((onset, index) => {
      if (judgementsRef.current[index]) {
        return;
      }
      const err = now - onset;
      if (bestIndex === -1 || Math.abs(err) < Math.abs(bestErr)) {
        bestIndex = index;
        bestErr = err;
      }
    });

    if (bestIndex === -1) {
      return;
    }

    const value = judge(bestErr);
    judgementsRef.current[bestIndex] = {
      noteIndex: bestIndex,
      verdict: value,
      errMs: bestErr,
    };
    publish();
    nonceRef.current += 1;
    setVerdict({ value, nonce: nonceRef.current });
    onNoteJudgedRef.current();
  }, [phase, publish]);

  useEffect(() => clearTimers, [clearTimers]);

  return {
    phase,
    countIndex,
    judgements,
    verdict,
    progress,
    start,
    stop,
    registerTap,
  };
}

export default useRhythmRound;
