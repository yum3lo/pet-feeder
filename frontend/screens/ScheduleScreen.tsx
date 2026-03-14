import { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Switch, FlatList, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/style';
import BottomNavBar from '@/components/BottomNavBar';
import MealModal, { type MealModalData } from '@/components/MealModal';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;

type Meal = { id: string; time: string; amount: string };

const initialMeals: Meal[] = [
  { id: '1', time: '10:00', amount: '80 g' },
  { id: '2', time: '17:00', amount: '80 g' },
];

export default function ScheduleScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [meals, setMeals] = useState<Meal[]>(initialMeals);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealModalData | null>(null);

  const openAdd = () => {
    setEditingMeal(null);
    setModalVisible(true);
  };

  const openEdit = (meal: Meal) => {
    setEditingMeal({ id: meal.id, time: meal.time, amount: meal.amount.replace(/[^0-9]/g, '') });
    setModalVisible(true);
  };

  const handleSave = (data: MealModalData) => {
    const formatted = `${data.amount} g`;
    if (data.id) {
      setMeals((prev) =>
        prev.map((m) => m.id === data.id ? { ...m, time: data.time, amount: formatted } : m)
      );
    } else {
      setMeals((prev) => [...prev, { id: Date.now().toString(), time: data.time, amount: formatted }]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Schedule
      </Text>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.toggleRow}>
          <MaterialIcons name="event-available" size={28} color={colors.stroke} />
          <Text style={[typography.bodyBold, styles.toggleLabel]}>Schedule</Text>
          <Switch
            value={scheduleEnabled}
            onValueChange={setScheduleEnabled}
            trackColor={{ false: colors.outline, true: colors.accent }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.mealsSection}>
          <Text style={[typography.bodyBold, styles.sectionLabel]}>Meals scheduled</Text>

          <FlatList
            data={meals}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.mealRow} onPress={() => openEdit(item)}>
                <Text style={[typography.bodySmall, { color: colors.stroke }]}>
                  {item.time} - {item.amount}
                </Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.stroke} />
              </TouchableOpacity>
            )}
          />

          <View style={styles.divider} />

          <TouchableOpacity style={styles.addMealButton} onPress={openAdd}>
            <Text style={[typography.bodyBold, { color: colors.accent }]}>
              + Add meal
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <MaterialIcons name="add" size={30} color={colors.background} />
      </TouchableOpacity>

      <BottomNavBar
        activeTab="schedule"
        onTabPress={(key) => {
          if (key === 'feed') navigation.navigate('Home');
          if (key === 'history') navigation.navigate('History');
          if (key === 'settings') navigation.navigate('Settings');
        }}
      />

      <MealModal
        visible={modalVisible}
        meal={editingMeal}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  toggleLabel: {
    flex: 1,
    color: colors.stroke,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outline,
    marginHorizontal: spacing.xl,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  mealsSection: {
    marginTop: spacing.xl,
  },
  sectionLabel: {
    color: colors.stroke,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  addMealButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: 130,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});
