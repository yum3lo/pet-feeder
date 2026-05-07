import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';

import { ActionButtons, Stepper } from '@/components';
import { usePets, useToast } from '@/contexts';
import { createSchedule, useGetPets } from '@/services';
import { useGetDevices } from '@/services/devices';
import { colors, typography, common } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SetFeeding'>;

const presetTimes = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
];

export default function SetFeedingScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customTime, setCustomTime] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [portionSize, setPortionSize] = useState(50);

  const { activePetIndex } = usePets();
  const { data: pets = [] } = useGetPets();
  const { data: devices = [] } = useGetDevices();
  const { showToast } = useToast();

  const activePet = pets[activePetIndex];

  const isCustom = selected !== null && !presetTimes.includes(selected);

  const selectTime = (time: string) => {
    setSelected((prev) => (prev === time ? null : time));
    setShowCustomInput(false);
    setCustomTime('');
  };

  const addCustomTime = () => {
    const trimmed = customTime.trim();
    if (/^\d{2}:\d{2}$/.test(trimmed)) {
      setSelected(trimmed);
      setCustomTime('');
      setShowCustomInput(false);
    }
  };

  const clearCustom = () => {
    setSelected(null);
    setCustomTime('');
    setShowCustomInput(false);
  };

  return (
    <>
      <View style={common.screenContainer}>
        <Text style={[typography.h2, common.title]}>
          Set feeding time
        </Text>
        <Text style={[typography.bodySmall, common.subtitle]}>
          Choose your pet's first feeding time
        </Text>

        <View style={styles.grid}>
          {presetTimes.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeButton, selected === time && styles.timeButtonActive]}
              onPress={() => selectTime(time)}
            >
              <Text
                style={[styles.timeText, selected === time && styles.timeTextActive]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}

          {isCustom ? (
            <TouchableOpacity
              style={[styles.timeButton, styles.timeButtonActive, styles.customChip]}
              onPress={clearCustom}
            >
              <Text style={[styles.timeText, styles.timeTextActive]}>{selected}</Text>
              <MaterialIcons name="close" size={16} color={colors.background} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.timeButton, styles.addButton]}
              onPress={() => setShowCustomInput(true)}
            >
              <MaterialIcons name="add" size={22} color={colors.accent} />
              <Text style={[styles.timeText, { color: colors.accent }]}>Custom</Text>
            </TouchableOpacity>
          )}
        </View>

        {showCustomInput && !isCustom && (
          <View style={styles.customRow}>
            <TextInput
              style={[common.input, styles.customInput]}
              placeholder="HH:MM"
              placeholderTextColor={colors.stroke}
              value={customTime}
              onChangeText={setCustomTime}
              keyboardType="numeric"
              maxLength={5}
              autoFocus
            />
            <TouchableOpacity
              style={[common.button, styles.confirmButton, { backgroundColor: colors.accent }]}
              onPress={addCustomTime}
            >
              <Text style={[typography.bodyBold, { color: colors.background }]}>Add</Text>
            </TouchableOpacity>
          </View>
        )}

        <Stepper
          label="Portion size"
          value={portionSize}
          onChange={setPortionSize}
          style={{ width: '90%', alignSelf: 'center', marginTop: 16, flexDirection: 'column', alignItems: 'center', gap: 8 }}
          labelStyle={{ textAlign: 'center' }}
          btnStyle={{ backgroundColor: 'rgba(232, 51, 6, 0.12)', borderRadius: 20, width: 40, height: 40 }}
        />

      </View>
      <View style={styles.bottomContainer}>
        <ActionButtons
          variant="modal"
          leftLabel="Skip"
          rightLabel="Set Time"
          onLeft={() => navigation.navigate('Home')}
          onRight={async () => {
            if (!selected || !activePet?.id) {
              navigation.navigate('Home');
              return;
            }
            try {
              await createSchedule({
                petId: activePet.id,
                time: selected,
                portionSize: portionSize,
                deviceId: devices[0]?.deviceId,
              });
              showToast('Feeding time set!', 'success');
              navigation.navigate('Home');
            } catch (err: any) {
              showToast(err?.response?.data?.message ?? 'Failed to set feeding time', 'error');
            }
          }}
        />
      </View>
    </>
  );
}

