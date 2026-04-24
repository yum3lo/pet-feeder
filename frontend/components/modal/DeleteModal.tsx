import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Logo } from '@/components';
import { colors, spacing, typography, radius } from '@/style';
import { toCapitalize } from '@/utils';

type Props = {
  visible: boolean;
  petName?: string;
  title?: string;
  body?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteModal({ visible, petName, title, body, confirmLabel = 'Delete', onConfirm, onClose }: Props) {
  const resolvedTitle = title ?? 'Are you sure?';
  const resolvedBody = body ?? `This will permanently delete ${
    petName ? toCapitalize(petName) : 'this item'
  } and all their data.`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.logoWrapper}>
            <Logo size={56} color={colors.accent} />
          </View>

          <Text style={[typography.h3, styles.title]}>{resolvedTitle}</Text>
          <Text style={[typography.body, styles.body]}>{resolvedBody}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
              <Text style={[typography.bodyBold, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={onConfirm}>
              <Text style={[typography.bodyBold, { color: colors.background }]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  logoWrapper: {
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    color: colors.stroke,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: colors.outline,
  },
  deleteBtn: {
    backgroundColor: colors.accent,
  },
});
