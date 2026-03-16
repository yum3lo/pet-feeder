import { Modal, StyleSheet, Text, View } from 'react-native';

import { ActionButtons } from '@/components';
import { colors, typography, spacing } from '@/style';

type Props = {
  visible: boolean;
  onClose: () => void;
  onStart: () => void;
};

export default function RecognitionPromptModal({ visible, onClose, onStart }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={[typography.h4, styles.title]}>Multiple Cats Detected</Text>
          <Text style={[typography.body, styles.body]}>
            Would you like to start cat recognition training to help your feeder distinguish between
            your cats?
          </Text>
          <ActionButtons
            variant="compact"
            leftLabel="Later"
            rightLabel="Start Recognition"
            onLeft={onClose}
            onRight={onStart}
          />
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
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  body: {
    color: colors.stroke,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
});
