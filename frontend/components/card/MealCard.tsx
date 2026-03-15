
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/style";

type Props = {
  catName: string;
  time?: string;
  amount?: number;
};

export default function MealCard({ catName, time, amount }: Props) {
  const hasSchedule = time != null && time !== '—';
  return (
    <View style={styles.card}>
      <MaterialIcons name="access-time" size={36} color={colors.accent} />
      <View style={styles.cardText}>
        <Text style={[typography.h4, { color: colors.text }]}>{catName}</Text>
        {hasSchedule ? (
          <Text style={[typography.bodySmall, { color: colors.stroke }]}>Next meal · {time} · {amount}g</Text>
        ) : (
          <Text style={[typography.bodySmall, { color: colors.inactive }]}>No meals scheduled yet</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 14,
    padding: spacing.lg,
    gap: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    flex: 1,
  },
});