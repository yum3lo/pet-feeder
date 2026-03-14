
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/style";

export default function MealCard() {
  return (
    <View style={styles.card}>
      <MaterialIcons name="access-time" size={36} color={colors.accent} />
      <View style={styles.cardText}>
        <Text style={[typography.h4, { color: colors.text }]}>Next meal</Text>
        <Text style={[typography.bodySmall, { color: colors.stroke }]}>14:00 - 80g</Text>
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