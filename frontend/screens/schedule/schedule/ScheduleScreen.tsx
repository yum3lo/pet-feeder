import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Text, View, TouchableOpacity, Switch, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {BottomNavBar, MealModal, type MealModalData, MealList, PetSelectorDropdown } from '@/components';
import { type MealItem } from "@/components/list/types";
import { usePets } from '@/contexts';
import { colors, typography, spacing } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';


type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;

type Meal = MealItem;

export default function ScheduleScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { pets, activePetIndex, updateSchedule, toggleSchedule } = usePets();
  const activePet = pets[activePetIndex];
  const scheduleEnabled = activePet?.scheduleEnabled ?? true;
  const meals: Meal[] = activePet?.meals ?? [];

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
    let updated: Meal[];
    if (data.id) {
      updated = meals.map((m) => m.id === data.id ? { ...m, time: data.time, amount: formatted } : m);
    } else {
      updated = [...meals, { id: Date.now().toString(), time: data.time, amount: formatted }];
    }
    updateSchedule(activePetIndex, updated);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    updateSchedule(activePetIndex, meals.filter((m) => m.id !== id));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Schedule
      </Text>

      <PetSelectorDropdown style={styles.petDropdown} />

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.toggleRow}>
          <MaterialIcons name="event-available" size={28} color={colors.stroke} />
          <Text style={[typography.bodyBold, styles.toggleLabel]}>Schedule</Text>
          <Switch
            value={scheduleEnabled}
            onValueChange={(val) => toggleSchedule(activePetIndex, val)}
            trackColor={{ false: colors.outline, true: colors.accent }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.mealsSection}>
          <Text style={[typography.bodyBold, styles.sectionLabel]}>Meals scheduled</Text>

          <MealList
            meals={meals}
            onPressItem={openEdit}
            onAdd={openAdd}
          />
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

