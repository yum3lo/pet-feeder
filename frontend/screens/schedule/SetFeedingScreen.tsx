import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, common, radius } from '@/style';
import ActionButtons from '@/components/actions/ActionButtons';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

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
          variant="row"
          leftLabel="Skip"
          rightLabel="Done"
          onLeft={() => navigation.navigate('Home')}
          onRight={() => navigation.navigate('Home')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xxl,
  },
  buttonHalf: {
    width: 110,
  },
  grid: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  timeButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  timeTextActive: {
    color: colors.background,
  },
  customRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  customInput: {
    flex: 1,
    marginBottom: 0,
  },
  confirmButton: {
    paddingHorizontal: spacing.lg,
    width: undefined,
    marginBottom: 0,
  },
  addButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  customChip: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  selectedContainer: {
    width: '80%',
    marginBottom: spacing.lg,
  },
  bottomContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
});
