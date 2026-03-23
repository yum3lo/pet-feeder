import { MaterialIcons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, spacing, typography } from '@/style';

type Props = {
  visible: boolean;
  syncedCount: number;
  onClose: () => void;
};

export default function BackOnlineModal({ visible, syncedCount, onClose }: Props) {
  const body =
    syncedCount === 1
      ? '1 pending change has been synced to the server.'
      : `${syncedCount} pending changes have been synced to the server.`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="cloud-done" size={48} color={colors.success} />
          </View>
          <Text style={[typography.h3, styles.title]}>You're back online</Text>
          <Text style={[typography.body, styles.body]}>{body}</Text>
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={[typography.bodyBold, { color: colors.success }]}>Got it</Text>
          </TouchableOpacity>
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
  iconWrapper: {
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    color: colors.stroke,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  btn: {
    alignSelf: 'flex-end',
  },
});
