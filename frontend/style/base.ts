import { StyleSheet} from 'react-native';

import { colors , spacing, radius} from './theme';


export const common = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: { 
    color: colors.text, 
    marginBottom: spacing.md 
  },
  subtitle: {
    color: colors.stroke,
    marginBottom: spacing.lg,
  },
  input: {
    width: '90%',
    height: 48,
    borderColor: colors.outline,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    color: colors.text,
  },
  button: {
    width: '90%',
    height: 48,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    width: '90%',
    height: 48,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.accent,
    borderWidth: 1 }
});