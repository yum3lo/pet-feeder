import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Modal,
} from 'react-native';

import { ActionButtons } from '@/components';
import DeleteModal from '@/components/modal/DeleteModal';
import { useToast } from '@/contexts';
import { colors, typography, spacing } from '@/style';

export type MealModalData = {
  id?: string;
  time: string;
  amount: string; 
};

type Props = {
  visible: boolean;
  meal?: MealModalData | null;
  onSave: (data: MealModalData) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const STEP = 10;
const MIN_AMOUNT = 10;
const MAX_AMOUNT = 300;

function parseTime(t: string) {
  const [h, m] = t.split(':');
  return { hour: (h ?? '09').padStart(2, '0'), minute: (m ?? '00').padStart(2, '0') };
}

export default function MealModal({ visible, meal, onSave, onDelete, onClose }: Props) {
  const isEdit = !!meal?.id;
  const { showToast } = useToast();

  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [hour, setHour] = useState(() => parseTime(meal?.time ?? '09:00').hour);
  const [minute, setMinute] = useState(() => parseTime(meal?.time ?? '09:00').minute);
  const [amount, setAmount] = useState(() => parseInt(meal?.amount ?? '80', 10));

  useEffect(() => {
    const { hour: h, minute: min } = parseTime(meal?.time ?? '09:00');
    setHour(h);
    setMinute(min);
    setAmount(parseInt(meal?.amount ?? '80', 10));
  }, [meal]);

  const adjust = (delta: number) =>
    setAmount((prev) => Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, prev + delta)));

  const handleSave = () => {
    onSave({ id: meal?.id, time: `${hour}:${minute}`, amount: String(amount) });
    showToast(isEdit ? 'Meal updated!' : 'Meal added!', 'success');
  };

  return (
    <>
      <Modal visible={visible && !deleteConfirmVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.h3, { color: colors.text }]}>
              {isEdit ? 'Edit meal' : 'Add meal'}
            </Text>
            {isEdit && (
              <TouchableOpacity
                onPress={() => setDeleteConfirmVisible(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete-outline" size={24} color={colors.stroke} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={[typography.bodySmall, styles.sectionLabel]}>Time</Text>
          <View style={styles.pickerRow}>
            <Picker
              selectedValue={hour}
              onValueChange={(v) => setHour(v)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {HOURS.map((h) => <Picker.Item key={h} label={h} value={h} />)}
            </Picker>
            <Text style={styles.colon}>:</Text>
            <Picker
              selectedValue={minute}
              onValueChange={(v) => setMinute(v)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {MINUTES.map((m) => <Picker.Item key={m} label={m} value={m} />)}
            </Picker>
          </View>

          <View style={styles.divider} />

          <View style={styles.portionRow}>
            <Text style={[typography.bodySmall, { color: colors.stroke }]}>Portion</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjust(-STEP)}>
                <MaterialIcons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.stepValue}>{amount} g</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjust(STEP)}>
                <MaterialIcons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <ActionButtons
            leftLabel="Cancel"
            rightLabel="Save"
            onLeft={onClose}
            onRight={handleSave}
          />
        </View>
      </View>
    </Modal>

      <DeleteModal
        visible={deleteConfirmVisible}
        title="Delete meal?"
        body={`Remove the ${meal?.time ?? ''} meal? This cannot be undone.`}
        onClose={() => setDeleteConfirmVisible(false)}
        onConfirm={() => {
          setDeleteConfirmVisible(false);
          onDelete?.(meal!.id!);
          showToast('Meal removed.', 'success');
        }}
      />
    </>  
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
  },
  sectionLabel: {
    color: colors.stroke,
    marginBottom: spacing.xs,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  picker: {
    flex: 1,
    height: 160,
  },
  pickerItem: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    height: 160,
  },
  colon: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outline,
    marginVertical: spacing.md,
  },
  portionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  cancelButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  saveButton: {
    marginLeft: spacing.xl,
    width: 110,
  },
});