import React, { useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { MAX_LEVEL, SCREEN_FADE_MS, DEFAULT_BPM, UNLOCK_ACCURACY } from './src/constants/config';
import { RoundResult } from './src/game/scoring';
import useSound from './src/hooks/useSound';
import DictationScreen from './src/screens/DictationScreen';
import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import SettingsScreen, { ClickSound } from './src/screens/SettingsScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import ValueChartScreen from './src/screens/ValueChartScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'dictation'
  | 'values'
  | 'settings';

/** State-machine navigation only — no @react-navigation (rule #2). */
function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [level, setLevel] = useState(1);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [clickSound, setClickSound] = useState<ClickSound>('WOOD');
  const [latencyMs, setLatencyMs] = useState(0);
  const [haptics, setHaptics] = useState(true);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [bestStreak, setBestStreak] = useState(0);
  const [weekTiming, setWeekTiming] = useState(0);

  const barsAtTargetRef = useRef(0);
  const fade = useRef(new Animated.Value(1)).current;
  const { click } = useSound(haptics);

  const go = useCallback(
    (next: Screen) => {
      Animated.timing(fade, {
        toValue: 0,
        duration: SCREEN_FADE_MS,
        useNativeDriver: true,
      }).start(() => {
        setScreen(next);
        Animated.timing(fade, {
          toValue: 1,
          duration: SCREEN_FADE_MS,
          useNativeDriver: true,
        }).start();
      });
    },
    [fade],
  );

  const handleLoaderDone = useCallback(() => {
    setScreen('menu');
    fade.setValue(1);
  }, [fade]);

  const handleGameOver = useCallback(
    (round: RoundResult) => {
      setResult(round);
      setBestStreak(prev => Math.max(prev, round.bestStreak));
      setWeekTiming(prev =>
        prev === 0 ? round.accuracy : Math.round((prev * 3 + round.accuracy) / 4),
      );

      if (round.accuracy >= UNLOCK_ACCURACY) {
        barsAtTargetRef.current += 1;
        if (barsAtTargetRef.current >= 3) {
          barsAtTargetRef.current = 0;
          setLevel(prev => Math.min(MAX_LEVEL, prev + 1));
        }
      } else {
        barsAtTargetRef.current = 0;
      }

      go('gameover');
    },
    [go],
  );

  const handleReplaySound = useCallback(() => {
    click(true);
  }, [click]);

  const goMenu = useCallback(() => go('menu'), [go]);
  const goGame = useCallback(() => go('game'), [go]);
  const goDictation = useCallback(() => go('dictation'), [go]);
  const goValues = useCallback(() => go('values'), [go]);
  const goSettings = useCallback(() => go('settings'), [go]);

  if (screen === 'loader') {
    return (
      <View style={styles.root}>
        <LoaderScreen onDone={handleLoaderDone} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        {screen === 'menu' ? (
          <MenuScreen
            level={level}
            weekTiming={weekTiming}
            bpm={bpm}
            onStart={goGame}
            onDictation={goDictation}
            onValues={goValues}
            onSettings={goSettings}
          />
        ) : null}

        {screen === 'game' ? (
          <GameScreen
            level={level}
            bpm={bpm}
            latencyMs={latencyMs}
            haptics={haptics}
            onGameOver={handleGameOver}
            onExit={goMenu}
          />
        ) : null}

        {screen === 'gameover' && result ? (
          <GameOverScreen
            result={result}
            bestStreak={bestStreak}
            onPlayAgain={goGame}
            onMenu={goMenu}
            onReplaySound={handleReplaySound}
          />
        ) : null}

        {screen === 'dictation' ? (
          <DictationScreen
            level={level}
            bpm={bpm}
            onBack={goMenu}
            onPlayRhythm={handleReplaySound}
          />
        ) : null}

        {screen === 'values' ? (
          <ValueChartScreen haptics={haptics} onBack={goMenu} />
        ) : null}

        {screen === 'settings' ? (
          <SettingsScreen
            bpm={bpm}
            clickSound={clickSound}
            latencyMs={latencyMs}
            haptics={haptics}
            onBpm={setBpm}
            onClickSound={setClickSound}
            onLatency={setLatencyMs}
            onHaptics={setHaptics}
            onBack={goMenu}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F1FA' },
});

export default App;
