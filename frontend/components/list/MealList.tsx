import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Switch } from 'react-native';

import { colors, typography, spacing } from '@/style';

import type {  MealProps  } from './types';

export default function MealList({ meals, onPressItem, onToggle, onAdd, emptyComponent }: MealProps) {
  return (
    <View>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={
          emptyComponent ?? <Text style={[typography.bodySmall, styles.empty]}>No meals added yet.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => onPressItem(item)}>
            <Text style={[typography.bodySmall, { color: colors.stroke }]}>
              {item.time} · {item.amount}
            </Text>
            <Switch
              value={item.isActive}
              onValueChange={(val) => onToggle(item.id, val)}
              trackColor={{ false: colors.outline, true: colors.accent }}
              thumbColor={colors.background}
            />
          </TouchableOpacity>
        )}
      />

      <View style={styles.divider} />

      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={[typography.bodyBold, { color: colors.accent }]}>+ Add meal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outline,
    marginHorizontal: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  empty: {
    color: colors.inactive,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  addButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
