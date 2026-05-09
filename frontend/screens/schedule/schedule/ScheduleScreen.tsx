import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {BottomNavBar, MealModal, type MealModalData, MealList, PetSelectorDropdown } from '@/components';
import { type MealItem } from "@/components/list/types";
import { usePets, useToast } from '@/contexts';
import { useGetPetSchedules, useGetPets, togglePetSchedule, createSchedule, updateSchedule, deleteSchedule } from '@/services';
import { useGetDevices } from '@/services/devices';
import { colors, typography, spacing } from '@/style';
import { toCapitalize } from '@/utils';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';


type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;

export default function ScheduleScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { activePetIndex } = usePets();
  const { showToast } = useToast();
  const { data: pets = [] } = useGetPets();
  const activePet = pets[activePetIndex];

  const { data: schedules = [], isLoading, refetch } = useGetPetSchedules(
    activePet?.id,
  );
  const { data: devices = [] } = useGetDevices();

  const toMealItems = (group: typeof schedules): MealItem[] =>
    group.map((s) => ({
      id: String(s.id),
      time: s.time,
      amount: `${s.portionSize} g`,
      isActive: s.isActive,
    }));

  const handleToggle = async (scheduleId: string, val: boolean) => {
    try {
      await togglePetSchedule(Number(scheduleId), val);
      const schedule = schedules.find((s) => String(s.id) === scheduleId);
      const petName = toCapitalize(activePet?.name ?? 'Pet');
      const time = schedule?.time ?? '';
      showToast(
        `${petName}'s ${time} meal is ${val ? 'activated' : 'deactivated'}`,
        'success',
      );
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to update schedule', 'error');
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealModalData | null>(null);
  const [activeDevice, setActiveDevice] = useState<{ deviceId: string; name: string } | null>(null);

  const openAdd = (device: { deviceId: string; name: string }) => {
    setActiveDevice(device);
    setEditingMeal(null);
    setModalVisible(true);
  };

  const openEdit = (meal: MealItem) => {
    setActiveDevice(null);
    setEditingMeal({ id: meal.id, time: meal.time, amount: meal.amount.replace(/[^0-9]/g, '') });
    setModalVisible(true);
  };

  const handleSave = async (data: MealModalData) => {
    setModalVisible(false);
    if (!activePet?.id) return;
    const portionSize = parseInt(data.amount, 10);
    try {
      if (data.id) {
        const patch: { time?: string; portionSize?: number } = {};
        if (data.time !== editingMeal?.time) patch.time = data.time;
        if (String(portionSize) !== editingMeal?.amount) patch.portionSize = portionSize;
        if (Object.keys(patch).length > 0) {
          await updateSchedule(Number(data.id), patch);
        }
        showToast('Meal updated!', 'success');
      } else {
        await createSchedule({ petId: activePet.id, time: data.time, portionSize, deviceId: activeDevice?.deviceId });
        showToast('Meal added!', 'success');
      }
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to save meal', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    setModalVisible(false);
    try {
      await deleteSchedule(Number(id));
      showToast('Meal deleted!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to delete meal', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Schedule
      </Text>

      <PetSelectorDropdown style={styles.petDropdown} />

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mealsSection}>
          <Text style={[typography.bodyBold, styles.sectionLabel]}>Meals scheduled</Text>
          <View style={styles.sectionLabelUnderline} />

          {isLoading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
          ) : (
            devices.map((device) => {
              const group = schedules.filter((s) => s.deviceId === device.deviceId);
              return (
                <View key={device.deviceId} style={styles.deviceGroup}>
                  <Text style={styles.deviceGroupLabel}>
                    {`Device ${toCapitalize(device.name || device.deviceId)}`}
                  </Text>
                  <MealList
                    meals={toMealItems(group)}
                    onPressItem={openEdit}
                    onToggle={handleToggle}
                    onAdd={() => openAdd({ deviceId: device.deviceId, name: toCapitalize(device.name || device.deviceId) })}
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
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => openAdd(devices[0] ? { deviceId: devices[0].deviceId, name: toCapitalize(devices[0].name || devices[0].deviceId) } : { deviceId: '', name: '' })}>
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
        title={activeDevice ? `Add meal on ${activeDevice.name}` : undefined}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

