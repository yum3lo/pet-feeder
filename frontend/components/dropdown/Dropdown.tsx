import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors, spacing, radius } from '@/style';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  placeholder?: string;
  options: DropdownOption[];
  value: string;
  onSelect: (value: string) => void;
  style?: object;
  compact?: boolean;
}

export default function Dropdown({ placeholder = 'Select', options, value, onSelect, style, compact }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact, style]}>
      <TouchableOpacity style={[styles.trigger, compact && styles.triggerCompact]} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.triggerText, compact && styles.triggerTextCompact, !selectedLabel && styles.placeholder]}>
          {selectedLabel || placeholder}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={compact ? 18 : 22} color={compact ? colors.accent : colors.stroke} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const selected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                  >
                    {selected && (
                      <MaterialIcons name="check" size={18} color={colors.text} style={styles.check} />
                    )}
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    marginBottom: spacing.lg,
  },
  wrapperCompact: {
    marginBottom: spacing.sm,
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
  trigger: {
    height: 48,
    borderColor: colors.outline,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  triggerCompact: {
    height: 32,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: 'transparent',
  },
  triggerText: {
    fontSize: 14,
    color: colors.text,
  },
  triggerTextCompact: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  placeholder: {
    color: colors.stroke,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  dropdown: {
    width: '80%',
    maxHeight: 350,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  optionSelected: {
    backgroundColor: '#F0F0EE',
  },
  check: {
    marginRight: spacing.sm,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: '500',
  },
});
