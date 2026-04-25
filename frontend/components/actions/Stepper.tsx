import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { colors, spacing, typography } from '@/style';

type Props = {
  label: string;
  value: number;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  iconColor?: string;
  labelStyle?: object;
  valueStyle?: object;
  btnStyle?: object;
  stepperContainerStyle?: object;
  style?: object;
};

export default function Stepper({
  label,
  value,
  unit = 'g',
  step = 10,
  min = 10,
  max = 300,
  onChange,
  iconColor = colors.text,
  labelStyle,
  valueStyle,
  btnStyle,
  stepperContainerStyle,
  style,
}: Props) {
  const adjust = (delta: number) =>
    onChange(Math.min(max, Math.max(min, value + delta)));

  return (
    <View style={[styles.row, style]}>
      <Text style={[typography.bodySmall, { color: colors.stroke }, labelStyle]}>{label}</Text>
      <View style={[styles.stepper, stepperContainerStyle]}>
        <TouchableOpacity style={[styles.stepBtn, btnStyle]} onPress={() => adjust(-step)}>
          <MaterialIcons name="remove" size={20} color={iconColor} />
        </TouchableOpacity>
        <Text style={[styles.stepValue, valueStyle]}>{value} {unit}</Text>
        <TouchableOpacity style={[styles.stepBtn, btnStyle]} onPress={() => adjust(step)}>
          <MaterialIcons name="add" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    minWidth: 64,
    textAlign: 'center',
  },
});
