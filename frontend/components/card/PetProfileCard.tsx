import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import breeds from '@/data/breeds.json';
import { colors, typography, spacing } from '@/style';
import { toCapitalize } from '@/utils';

import type { Pet } from '@/types';

const getBreedLabel = (value: string) =>
  breeds.find((b) => b.value === value)?.label ?? value;

type Props = {
  item: Pet;
  index: number;
  currentIndex: number;
  petsCount: number;
  cardHeight: number;
  setCardHeight: (h: number) => void;
  onEdit: () => void;
};

export default function PetProfileCard({
  item,
  index,
  currentIndex,
  petsCount,
  cardHeight,
  setCardHeight,
  onEdit,
}: Props) {
  return (
    <View
      style={styles.card}
      onLayout={
        index === 0 && cardHeight === 0
          ? (e) => setCardHeight(e.nativeEvent.layout.height)
          : undefined
      }
    >
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <MaterialIcons name="edit" size={20} color={colors.accent} />
      </TouchableOpacity>

      <View style={styles.avatarSpacer} />

      <Text style={[typography.h3, styles.petName]}>{toCapitalize(item.name)}</Text>

      {petsCount > 1 && (
        <View style={styles.dots}>
          {Array.from({ length: petsCount }).map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={[typography.bodyBold, { color: colors.stroke }]}>Breed</Text>
        <Text style={[typography.body, { color: colors.stroke }]}>
          {getBreedLabel(item.breed ?? '')}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[typography.bodyBold, { color: colors.stroke }]}>Weight</Text>
        <Text style={[typography.body, { color: colors.stroke }]}>
          {item.weight != null ? `${item.weight} kg` : '—'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    elevation: 8,
  },
  editButton: {
    alignSelf: 'flex-end',
  },
  avatarSpacer: {
    height: 44,
  },
  petName: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.outline,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outline,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
});
