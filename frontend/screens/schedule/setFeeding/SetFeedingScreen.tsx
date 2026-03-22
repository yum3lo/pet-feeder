import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';

import { ActionButtons } from '@/components';
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

        {selected !== null && (
          <View style={styles.selectedContainer}>
            <Text style={[typography.bodySmall, { color: colors.stroke }]}>
              Selected: {selected}
            </Text>
          </View>
        )}

      </View>
      <View style={styles.bottomContainer}>
        <ActionButtons
          variant="modal"
          leftLabel="Skip"
          rightLabel="Set Time"
          onLeft={() => navigation.navigate('Home')}
          onRight={() => navigation.navigate('Home')}
        />
      </View>
    </>
  );
}

