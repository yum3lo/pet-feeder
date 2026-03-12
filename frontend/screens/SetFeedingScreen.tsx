import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, common, radius } from '../style';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SetFeeding'>;

const presetTimes = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '18:00',
  '20:00',
];

export default function SetFeedingScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState('');

  const toggleTime = (time: string) => {
    setSelected((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const addCustomTime = () => {
    const trimmed = customTime.trim();
    if (/^\d{2}:\d{2}$/.test(trimmed) && !selected.includes(trimmed)) {
      setSelected((prev) => [...prev, trimmed]);
      setCustomTime('');
    }
  };

  return (
    <>
      <View style={common.screenContainer}>
        <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.md }]}>
          Set feeding times
        </Text>
        <Text style={[typography.bodySmall, { color: colors.stroke, marginBottom: spacing.xl }]}>
          Choose your pet's first feeding time
        </Text>

        <View style={styles.grid}>
          {presetTimes.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeButton, selected.includes(time) && styles.timeButtonActive]}
              onPress={() => toggleTime(time)}
            >
              <Text
                style={[styles.timeText, selected.includes(time) && styles.timeTextActive]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customRow}>
          <TextInput
            style={[common.input, styles.customInput]}
            placeholder="HH:MM"
            placeholderTextColor={colors.stroke}
            value={customTime}
            onChangeText={setCustomTime}
            keyboardType="numeric"
            maxLength={5}
          />
          <TouchableOpacity
            style={[styles.timeButton, styles.addButton]}
            onPress={addCustomTime}
          >
            <MaterialIcons name="add" size={22} color={colors.accent} />
            <Text style={[styles.timeText, { color: colors.accent }]}>Custom</Text>
          </TouchableOpacity>
        </View>

        {selected.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={[typography.bodySmall, { color: colors.stroke, marginBottom: spacing.sm }]}>
              Selected: {selected.sort().join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[common.button, styles.buttonHalf]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[typography.body, { color: colors.accent }]}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[common.button, styles.buttonHalf, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[typography.body, { color: colors.background }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.backContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('AddPetPhoto')}
        >
          <MaterialIcons name="keyboard-backspace" size={24} color={colors.accent} />
          <Text style={[typography.bodySmall, { color: colors.accent }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    width: '90%',
    flexDirection: 'row',
    gap: spacing.md,
  },
  buttonHalf: {
    flex: 1,
    width: undefined,
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
  addButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  selectedContainer: {
    width: '90%',
    marginBottom: spacing.lg,
  },
  backContainer: {
    backgroundColor: colors.background,
    paddingBottom: spacing.md,
    paddingLeft: spacing.xxl,
  },
  backButton: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
});
