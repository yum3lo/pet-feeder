import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors } from '@/style';

type Props = {
  onPress: () => void;
};

export default function FeedButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name="pets" size={96} color={colors.accent} />
      <Text style={styles.label}>Feed</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
});
