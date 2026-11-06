import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  overlay: readonly string[];
  dark?: boolean;
  decor?: React.ReactNode;
  children: React.ReactNode;
};

/** Shared base wash under every screen; the overlay is what tells them apart. */
const BASE = ['#F4F1FA', '#E4DCF4', '#CFC3EC'];

/**
 * Every screen sits on the same base gradient and is told apart by its own
 * gradient overlay (rule #14). No ScrollView wrapper (rule #3).
 */
function AppShell({ overlay, dark, decor, children }: Props) {
  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      <LinearGradient
        colors={BASE}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={overlay as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {decor ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {decor}
        </View>
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F1FA' },
  content: { flex: 1 },
});

export default AppShell;
