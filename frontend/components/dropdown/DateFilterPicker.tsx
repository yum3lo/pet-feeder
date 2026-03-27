import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { colors, typography, spacing } from '@/style';

type Props = {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  markedDates?: Record<string, object>;
};

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { month: 'long', day: 'numeric' });
}

export default function DateFilterPicker({ selectedDate, onSelectDate, markedDates = {} }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setOpen((v) => !v)}
      >
        <MaterialIcons name="calendar-today" size={18} color={selectedDate ? colors.accent : colors.stroke} />
        <Text style={[typography.bodySmall, { color: selectedDate ? colors.accent : colors.stroke, flex: 1 }]}>
          {selectedDate ? formatDate(selectedDate) : 'Search by specific date'}
        </Text>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color={colors.stroke}
        />
      </TouchableOpacity>

      {open && (
        <Calendar
          onDayPress={(day) => {
            onSelectDate(selectedDate === day.dateString ? null : day.dateString);
            setOpen(false);
          }}
          markedDates={{
            ...markedDates,
            ...(selectedDate
              ? { [selectedDate]: { selected: true, selectedColor: colors.accent } }
              : {}),
          }}
          theme={{
            todayTextColor: colors.accent,
            arrowColor: colors.accent,
            dotColor: colors.accent,
            selectedDotColor: colors.background,
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
          style={styles.calendar}
        />
      )}

      {selectedDate && (
        <TouchableOpacity
          onPress={() => { onSelectDate(null); setOpen(false); }}
          style={styles.clearRow}
        >
          <Text style={[typography.bodySmall, { color: colors.accent }]}>Clear filter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  calendar: {
    marginBottom: spacing.lg,
    borderRadius: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  clearRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});
