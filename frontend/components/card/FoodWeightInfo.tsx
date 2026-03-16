import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/style';

type Props = {
  grams: number;
};

export default function FoodWeightInfo({ grams }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[typography.h3, styles.value]}>{grams}g</Text>
      <Text style={[typography.bodySmall, styles.label]}>Food weight</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  value: {
    color: colors.background,
    fontWeight: '700',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
});
