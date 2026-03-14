import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/style';
import BottomNavBar from '@/components/BottomNavBar';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const MOCK_PET = {
  name: 'Pookie',
  breed: 'Scottish',
  weight: '12 kg',
  photo: 'https://placecats.com/200/200',
};

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [pet] = useState(MOCK_PET);

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Pet profile
      </Text>

      <View style={styles.scrollArea}>
        <View style={styles.cardWrapper}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: pet.photo }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={colors.stroke} />
            </TouchableOpacity>

            <View style={styles.avatarSpacer} />

            <Text style={[typography.h3, styles.petName]}>{pet.name}</Text>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={[typography.bodyBold, { color: colors.stroke }]}>Breed</Text>
              <Text style={[typography.body, { color: colors.stroke }]}>{pet.breed}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[typography.bodyBold, { color: colors.stroke }]}>Weight</Text>
              <Text style={[typography.body, { color: colors.stroke }]}>{pet.weight}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.addPetButton}>
          <Text style={[typography.body, { color: colors.accent, fontWeight: '600' }]}>
            + Add another cat
          </Text>
        </TouchableOpacity>
      </View>

      <BottomNavBar
        activeTab="settings"
        onTabPress={(key) => {
          if (key === 'feed') navigation.navigate('Home');
          if (key === 'schedule') navigation.navigate('Schedule');
          if (key === 'history') navigation.navigate('History');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  avatarContainer: {
    zIndex: 1,
    marginBottom: -60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.background,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
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
  addPetButton: {
    marginTop: spacing.xl,
  },
});
