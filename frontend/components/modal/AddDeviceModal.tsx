import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';

import { useToast } from '@/contexts';
import { registerDevice } from '@/services/devices';
import { colors, spacing, typography, radius } from '@/style';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddDeviceModal({ visible, onClose }: Props) {
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const handleClose = () => {
    setName('');
    setDeviceId('');
    onClose();
  };

  const handleAdd = async () => {
    const trimmedName = name.trim();
    const trimmedId = deviceId.trim();
    if (!trimmedName || !trimmedId) return;
    setIsPending(true);
    try {
      await registerDevice({ deviceId: trimmedId, name: trimmedName });
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      showToast('Device added!', 'success');
      handleClose();
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to add device', 'error');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={[typography.h3, styles.title]}>Add a new device</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="close" size={20} color={colors.stroke} />
            </TouchableOpacity>
          </View>

          <Text style={[typography.bodySmall, styles.subtitle]}>
            Give your feeder a friendly name so you can tell them apart.
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Living Room Feeder"
              placeholderTextColor={colors.stroke}
              value={name}
              onChangeText={(v) => setName(v)}
              autoFocus
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Device ID"
              placeholderTextColor={colors.stroke}
              value={deviceId}
              onChangeText={(v) => setDeviceId(v)}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
          </View>
          <Text style={styles.hint}>You can find it on the sticker on the back of your feeder.</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={handleClose}>
              <Text style={[typography.bodyBold, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.addBtn, (!name.trim() || !deviceId.trim()) && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={isPending || !name.trim() || !deviceId.trim()}
            >
              {isPending
                ? <ActivityIndicator size="small" color={colors.background} />
                : <Text style={[typography.bodyBold, { color: colors.background }]}>Add</Text>
              }
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
  },
  subtitle: {
    color: colors.stroke,
    lineHeight: 20,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  input: {
    fontSize: 14,
    color: colors.text,
  },
  hint: {
    fontSize: 10,
    color: colors.stroke,
    paddingHorizontal: spacing.xs,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
  btn: {
    height: 44,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    paddingHorizontal: spacing.md,
  },
  addBtn: {
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.accent,
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
});
