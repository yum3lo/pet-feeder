import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

import { Dropdown } from '@/components';
import dietaryOptions from '@/data/dietary_restrictions.json';
import { colors, spacing } from '@/style';

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
  style?: ViewStyle;
};

const getLabel = (val: string) =>
  dietaryOptions.find((o) => o.value === val)?.label ?? val;

export default function DietaryRestrictionsField({ value, onChange, style }: Props) {
  const [custom, setCustom] = useState('');

  const available = dietaryOptions.filter((o) => !value.includes(o.value));

  const add = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  };

  const remove = (item: string) => onChange(value.filter((v) => v !== item));

  const handleCustomAdd = () => {
    add(custom);
    setCustom('');
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        <Text style={styles.label}>Dietary Restrictions</Text>

        {value.length > 0 && (
          <View style={styles.tags}>
            {value.map((item) => (
              <TouchableOpacity key={item} style={styles.tag} onPress={() => remove(item)}>
                <Text style={styles.tagText}>{getLabel(item)}</Text>
                <MaterialIcons name="close" size={12} color={colors.accent} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {available.length > 0 && (
          <Dropdown
            compact
            placeholder="+ Add from list…"
            options={available}
            value=""
            onSelect={(v) => add(v)}
            style={{ marginBottom: spacing.sm, alignSelf: 'flex-start' }}
            triggerTextStyle={{ color: colors.text, fontWeight: '500', fontSize: 14 }}
            triggerIconColor={colors.text}
          />
        )}

        <View style={styles.customRow}>
          <TextInput
            style={styles.customInput}
            placeholder="Or type a custom restriction…"
            placeholderTextColor={colors.stroke}
            value={custom}
            onChangeText={setCustom}
            onSubmitEditing={handleCustomAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addBtn, !custom.trim() && styles.addBtnDisabled]}
            onPress={handleCustomAdd}
            disabled={!custom.trim()}
          >
            <MaterialIcons name="add" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 10,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.stroke,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '15',
    borderWidth: 1,
    borderColor: colors.accent + '40',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    gap: spacing.xs,
  },
  tagText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 10,
    paddingHorizontal: spacing.xl,
    color: colors.text,
    fontSize: 14,
    backgroundColor: colors.background,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: colors.outline,
  },
});
