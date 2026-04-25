import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import catBreeds from '@/data/cat_breeds.json';
import dietaryOptions from '@/data/dietary_restrictions.json';
import dogBreeds from '@/data/dog_breeds.json';
import { colors, typography, spacing } from '@/style';
import { toCapitalize } from '@/utils';

import type { Pet } from '@/types';

const AVATAR_SIZE = 120;

const allBreeds = [...catBreeds, ...dogBreeds];

const getBreedLabel = (value?: string) =>
  allBreeds.find((b) => b.value === value)?.label ?? value ?? '—';

const getDietLabel = (val: string) =>
  dietaryOptions.find((o) => o.value === val)?.label ?? val;


type Props = {
  item: Pet;
  index: number;
  currentIndex: number;
  petsCount: number;
  cardHeight: number;
  setCardHeight: (h: number) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PetProfileCard({
  item,
  index,
  currentIndex,
  petsCount,
  cardHeight,
  setCardHeight,
  onEdit,
  onDelete,
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
      <View style={styles.avatarContainer}>
        <Image
          source={item.imageUrl ? { uri: item.imageUrl } : require('@/assets/pfp.jpg')}
          style={styles.avatar}
        />
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <MaterialIcons name="delete-outline" size={24} color={colors.stroke} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <MaterialIcons name="edit" size={20} color={colors.accent} />
      </TouchableOpacity>

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
          {getBreedLabel(item.breed)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[typography.bodyBold, { color: colors.stroke }]}>Weight</Text>
        <Text style={[typography.body, { color: colors.stroke }]}>
          {item.weight != null ? `${item.weight} kg` : '—'}
        </Text>
      </View>

      {item.dietaryRestrictions && item.dietaryRestrictions.length > 0 && (
        item.dietaryRestrictions.length === 1 ? (
          <View style={styles.infoRow}>
            <Text style={[typography.bodyBold, { color: colors.stroke }]}>Dietary Restrictions</Text>
            <View style={styles.dietTag}>
              <Text style={styles.dietTagText}>{getDietLabel(item.dietaryRestrictions[0])}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.dietSection}>
            <Text style={[typography.bodyBold, { color: colors.stroke, marginBottom: spacing.sm }]}>Dietary Restrictions</Text>
            <View style={styles.dietTags}>
              {item.dietaryRestrictions.map((r) => (
                <View key={r} style={styles.dietTag}>
                  <Text style={styles.dietTagText}>{getDietLabel(r)}</Text>
                </View>
              ))}
            </View>
          </View>
        )
      )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    overflow: 'visible',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -(AVATAR_SIZE / 2),
    marginBottom: spacing.md,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: colors.background,
  },
  deleteButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.xl,
  },
  editButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.xl,
  },
  topRow: {},
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
  dietSection: {
    marginTop: spacing.xs,
  },
  dietTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dietTag: {
    backgroundColor: colors.accent + '18',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  dietTagText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '500',
  },
});
