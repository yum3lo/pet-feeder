import { StyleSheet, TextStyle} from 'react-native';

export const colors = {
  accent: '#E83306',

  background: '#F8F9FA',

  text: '#3C3A3A',
  stroke: '#7C7B73',
  outline: '#D4D3D0',

  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  inactive: '#B6B6B6',

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
  circle: 50,
} as const;

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: '600', lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '700', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
};


