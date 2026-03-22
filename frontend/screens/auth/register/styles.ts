import { StyleSheet} from 'react-native';

import { colors, spacing} from '@/style';

export const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    width: '90%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.stroke,
  },
  separatorText: {
    color: colors.stroke,
    marginHorizontal: spacing.sm,
  },
});
