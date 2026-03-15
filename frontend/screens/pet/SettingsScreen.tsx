import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/style';
import BottomNavBar from '@/components/nav/BottomNavBar';
import AddPetModal, { type PetData } from '@/components/modal/AddPetModal';
import { PagingCarousel, type PagingCarouselHandle } from '@/components/list/PagingCarousel';
import { usePets } from '@/contexts/PetsContext';
import breeds from '@/data/breeds.json';
import ActionButtons from '@/components/actions/ActionButtons';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const CARD_WIDTH = Dimensions.get('window').width - 48; // screen - 2 * paddingHorizontal

const getBreedLabel = (value: string) =>
  breeds.find((b) => b.value === value)?.label ?? value;

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { pets, addPet, updatePet, activePetIndex, setActivePetIndex } = usePets();
  const currentIndex = activePetIndex;
  const setCurrentIndex = setActivePetIndex;
  const carouselRef = useRef<PagingCarouselHandle>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [recognitionModalVisible, setRecognitionModalVisible] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  // Restore scroll position when navigating back
  useEffect(() => {
    if (activePetIndex > 0 && pets.length > activePetIndex) {
      const t = setTimeout(() => {
        carouselRef.current?.scrollToIndex(activePetIndex);
      }, 50);
      return () => clearTimeout(t);
    }
  }, []);

  const currentPet = pets[currentIndex];

  const handleAddPet = (data: PetData) => {
    const newPet = {
      id: Date.now().toString(),
      ...data,
      weight: data.weight ? `${data.weight} kg` : '',
      photo: data.photo ?? '',
      scheduleEnabled: true,
      meals: [],
    };
    addPet(newPet);
    setAddModalVisible(false);
    setTimeout(() => {
      carouselRef.current?.scrollToIndex(pets.length, true);
      setCurrentIndex(pets.length);
    }, 100);
    if (pets.length + 1 >= 2) {
      setTimeout(() => setRecognitionModalVisible(true), 400);
    }
  };

  const handleEditPet = (data: PetData) => {
    updatePet(currentIndex, {
      ...data,
      weight: data.weight ? `${data.weight} kg` : currentPet.weight,
      photo: data.photo ?? currentPet.photo,
    });
    setEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Pet Profile
      </Text>

      <View style={styles.scrollArea}>
        <View style={styles.cardWrapper}>
          {/* Shadow backdrop – rendered before (behind) the FlatList so it isn't clipped by the scroll container */}
          {cardHeight > 0 && (
            <View pointerEvents="none" style={[styles.cardShadowLayer, { height: cardHeight }]} />
          )}

          <View style={styles.avatarContainer}>
            <Image source={{ uri: currentPet.photo }} style={styles.avatar} />
          </View>

          <PagingCarousel
            ref={carouselRef}
            data={pets}
            keyExtractor={(item) => item.id}
            itemWidth={CARD_WIDTH}
            onIndexChange={setCurrentIndex}
            renderItem={(item, index) => (
              <View
                style={styles.card}
                onLayout={index === 0 && cardHeight === 0
                  ? (e) => setCardHeight(e.nativeEvent.layout.height)
                  : undefined
                }
              >
                <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
                  <MaterialIcons name="edit" size={20} color={colors.accent} />
                </TouchableOpacity>

                <View style={styles.avatarSpacer} />

                <Text style={[typography.h3, styles.petName]}>{item.name}</Text>

                {pets.length > 1 && (
                  <View style={styles.dots}>
                    {pets.map((_, i) => (
                      <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
                    ))}
                  </View>
                )}

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={[typography.bodyBold, { color: colors.stroke }]}>Breed</Text>
                  <Text style={[typography.body, { color: colors.stroke }]}>{getBreedLabel(item.breed)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[typography.bodyBold, { color: colors.stroke }]}>Weight</Text>
                  <Text style={[typography.body, { color: colors.stroke }]}>{item.weight}</Text>
                </View>
              </View>
            )}
          />
        </View>

        <TouchableOpacity style={styles.addPetButton} onPress={() => setAddModalVisible(true)}>
          <Text style={[typography.body, { color: colors.accent, fontWeight: '600' }]}>
            + Add another cat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={[typography.body, { color: colors.text }]}>Logout</Text>
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

      <AddPetModal
        visible={addModalVisible}
        onSave={handleAddPet}
        onClose={() => setAddModalVisible(false)}
      />

      <AddPetModal
        visible={editModalVisible}
        initialData={{ name: currentPet.name, breed: currentPet.breed, weight: currentPet.weight.replace(/[^0-9.]/g, ''), photo: currentPet.photo }}
        onSave={handleEditPet}
        onClose={() => setEditModalVisible(false)}
      />

      <Modal
        visible={recognitionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRecognitionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[typography.h4, styles.modalTitle]}>Multiple Cats Detected</Text>
            <Text style={[typography.body, styles.modalBody]}>
              Would you like to start cat recognition training to help your feeder distinguish between your cats?
            </Text>
            <ActionButtons
              variant="compact"
              leftLabel="Later"
              rightLabel="Start Recognition"
              onLeft={() => setRecognitionModalVisible(false)}
              onRight={() => {
                setRecognitionModalVisible(false);
                navigation.navigate('CatRecognition', {
                  petNames: pets.map((p) => p.name),
                  currentIndex: 0,
                });
              }}
            />
          </View>
        </View>
      </Modal>
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
    paddingVertical: 14,
  },
  cardShadowLayer: {
    position: 'absolute',
    top: 60,
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 0, 
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
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    elevation: 8, 
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
  logoutButton: {
    marginTop: spacing.lg,
    width: CARD_WIDTH,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalCard: {
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
  modalTitle: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalBody: {
    color: colors.stroke,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  laterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  startRecognitionButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
});
