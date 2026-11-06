/**
 * NORDIC_MINIMAL preset copy.
 * Only the accent colours are overridden to the brief's violet / orange —
 * the `name` field keeps the preset value (codegen rule #11b).
 */
export const theme = {
  name: 'nordic-minimal',
  colors: {
    bg: {
      primary: '#F4F1FA',
      secondary: '#EDE7F8',
      tertiary: '#E4DCF4',
      deep: '#231A3D',
      accent: '#EFEAF8',
    },
    surface: {
      card: '#FFFFFF',
      alt: '#EFEAF8',
      glass: 'rgba(255,255,255,0.72)',
      onDark: 'rgba(255,255,255,0.08)',
      onDarkStrong: 'rgba(255,255,255,0.12)',
    },
    accent: {
      primary: '#5B3FA8',
      primaryLight: '#6B4CC0',
      primaryDeep: '#4A3190',
      secondary: '#F2711C',
      secondaryLight: '#FFB36B',
    },
    text: {
      primary: '#231A3D',
      secondary: '#6B5E8A',
      muted: '#8E82AB',
      onDark: '#FFFFFF',
      onDarkSoft: '#DCD3F0',
      onDarkMuted: '#BFB2DE',
    },
    ui: {
      border: '#DCD3F0',
      borderStrong: '#C9BEE4',
      divider: '#ECE6F7',
      borderOnDark: 'rgba(255,255,255,0.22)',
    },
    semantic: {
      on: '#3FAE6A',
      near: '#E8A33D',
      miss: '#D64545',
      ink: '#231A3D',
    },
  },
  gradients: {
    primary: ['#6B4CC0', '#5B3FA8'] as const,
    pad: ['#5B3FA8', '#4A3190'] as const,
    accent: ['#F2711C', '#FFB36B'] as const,
    loader: ['rgba(35,26,61,0.92)', 'rgba(91,63,168,0.88)', 'rgba(35,26,61,0.94)'] as const,
    menu: ['rgba(244,241,250,0.90)', 'rgba(237,231,248,0.94)', 'rgba(228,220,244,0.97)'] as const,
    game: ['rgba(244,241,250,0.95)', 'rgba(240,235,250,0.97)', 'rgba(237,231,248,0.98)'] as const,
    result: ['rgba(244,241,250,0.93)', 'rgba(238,232,248,0.96)', 'rgba(233,226,246,0.97)'] as const,
  },
  typography: {
    hero: { fontSize: 46, fontWeight: '800' as const, letterSpacing: -0.5 },
    heroLoader: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 3.5 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 0 },
    subtitle: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    body: { fontSize: 15, fontWeight: '400' as const, letterSpacing: 0.1 },
    caption: {
      fontSize: 11,
      fontWeight: '700' as const,
      letterSpacing: 1.6,
      textTransform: 'uppercase' as const,
    },
    button: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 1.6, lineHeight: 24 },
    number: { fontSize: 22, fontWeight: '800' as const, letterSpacing: 0 },
  },
  radius: { sm: 10, md: 14, lg: 18, xl: 28, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 32 },
  shadows: {
    paper: {
      shadowColor: '#231A3D',
      shadowOpacity: 0.07,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    cta: {
      shadowColor: '#5B3FA8',
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    pad: {
      shadowColor: '#5B3FA8',
      shadowOpacity: 0.3,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: -6 },
      elevation: 10,
    },
  },
} as const;

export type Theme = typeof theme;
export default theme;
