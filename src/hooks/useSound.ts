import { useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import { HAPTIC_TAP_MS } from '../constants/config';

/**
 * Built-in click / tick feedback.
 *
 * No audio dependency is permitted in this project, so the metronome click and
 * the note tick are rendered as short haptic pulses (VIBRATE is declared in
 * AndroidManifest.xml). The API is deliberately shaped like an audio player so
 * the call sites do not change if a sound engine is added later.
 */
export function useSound(enabled: boolean) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const click = useCallback((accent?: boolean) => {
    if (!enabledRef.current) {
      return;
    }
    Vibration.vibrate(accent ? 22 : 10);
  }, []);

  const tick = useCallback(() => {
    if (!enabledRef.current) {
      return;
    }
    Vibration.vibrate(HAPTIC_TAP_MS);
  }, []);

  const stop = useCallback(() => {
    Vibration.cancel();
  }, []);

  return { click, tick, stop };
}

export default useSound;
