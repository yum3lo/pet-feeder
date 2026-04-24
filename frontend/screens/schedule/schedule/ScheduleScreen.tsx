import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Text, View, TouchableOpacity, Switch, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {BottomNavBar, MealModal, type MealModalData, MealList, PetSelectorDropdown } from '@/components';
import { type MealItem } from "@/components/list/types";
import { usePets } from '@/contexts';
import { useGetPetSchedules, useGetPets, togglePetSchedule } from '@/services';
import { colors, typography, spacing } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';


type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;

export default function ScheduleScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { activePetIndex } = usePets();
  const { data: pets = [] } = useGetPets();
  const activePet = pets[activePetIndex];
  const [scheduleEnabled, setScheduleEnabled] = useState(true);

  const handleToggle = async (val: boolean) => {
    setScheduleEnabled(val);
    if (activePet?.id != null) {
      await togglePetSchedule(activePet.id, val);
    }
  };

  const { data: schedules = [], isLoading } = useGetPetSchedules(
    activePet?.id,
  );
  const meals: MealItem[] = schedules.map((s) => ({
    id: String(s.id),
    time: s.time,
    amount: `${s.amount} g`,
  }));

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealModalData | null>(null);

  const openAdd = () => {
    setEditingMeal(null);
    setModalVisible(true);
  };

  const openEdit = (meal: MealItem) => {
    setEditingMeal({ id: meal.id, time: meal.time, amount: meal.amount.replace(/[^0-9]/g, '') });
    setModalVisible(true);
  };

  const handleSave = (_data: MealModalData) => {
    setModalVisible(false);
  };

  const handleDelete = (_id: string) => {
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
            onValueChange={handleToggle}
            trackColor={{ false: colors.outline, true: colors.accent }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.mealsSection}>
          <Text style={[typography.bodyBold, styles.sectionLabel]}>Meals scheduled</Text>

          {isLoading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
          ) : (
            <MealList
              meals={meals}
              onPressItem={openEdit}
              onAdd={openAdd}
              emptyComponent={
                <View style={styles.emptyState}>
                  <Image
                    source={require('../../../assets/no-schedule.png')}
                    style={styles.emptyImage}
                    resizeMode="contain"
                  />
                  <Text style={[typography.bodySmall, styles.emptyText]}>
                    No scheduled meals yet.
                  </Text>
                </View>
              }
            />
          )}
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

