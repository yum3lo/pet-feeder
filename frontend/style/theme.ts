import { TextStyle, ViewStyle, Platform } from 'react-native';

// ─── Colors ──────────────────────────────────────────────
export const colors = {
  accent: '#E83306',

  background: '#F8F9FA',

  text: '#3C3A3A',
  stroke: '#7C7B73',


  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;


export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;


export const radius = {
  input: 10,
  circle:50,
} as const;


export const typography: Record<string, TextStyle> = {
  h1:        { fontSize: 32, fontWeight: '700', lineHeight: 38 },
  h2:        { fontSize: 24, fontWeight: '600', lineHeight: 30 },
  h3:        { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body:      { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  caption:   { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  label:     { fontSize: 12, fontWeight: '500', lineHeight: 18, textTransform: 'uppercase', letterSpacing: 1 },
};


export const shadows: Record<string, ViewStyle> = {
  sm: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    android: { elevation: 2 },
    default: {},
  }) as ViewStyle,
  md: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 },
    android: { elevation: 4 },
    default: {},
  }) as ViewStyle,
  lg: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
    android: { elevation: 8 },
    default: {},
  }) as ViewStyle,
};
