import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddPetModal, BottomNavBar, DeleteModal, PagingCarousel, PetProfileCard, RecognitionPromptModal } from '@/components';
import { usePets } from '@/contexts';
import { useSettingsPets } from '@/hooks';
import { useGetPets, useDeleteCat, logoutUser } from '@/services';
import { colors, typography, spacing } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles, CARD_WIDTH } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { data: pets = [], isLoading } = useGetPets();
  const { activePetIndex: currentIndex, setActivePetIndex: setCurrentIndex } = usePets();

  const {
    carouselRef,
    addModalVisible, setAddModalVisible,
    editModalVisible, setEditModalVisible,
    recognitionModalVisible, setRecognitionModalVisible,
    cardHeight, setCardHeight,
    handleAddPet,
    handleEditPet,
  } = useSettingsPets({ pets, currentIndex, setCurrentIndex });

  const { mutate: deleteCat } = useDeleteCat();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const currentPet = pets[currentIndex];

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Pet Profile
      </Text>

      <View style={styles.scrollArea}>
        <View style={styles.cardWrapper}>
          {cardHeight > 0 && (
            <View pointerEvents="none" style={[styles.cardShadowLayer, { height: cardHeight }]} />
          )}

          <View style={styles.avatarContainer}>
            <Image
              source={currentPet?.imageUrl ? { uri: currentPet.imageUrl } : require('@/assets/pfp.jpg')}
              style={styles.avatar}
            />
          </View>

          <PagingCarousel
            ref={carouselRef}
            data={pets}
            keyExtractor={(item) => String(item.id)}
            itemWidth={CARD_WIDTH}
            onIndexChange={setCurrentIndex}
            renderItem={(item, index) => (
              <View style={{ width: CARD_WIDTH }}>
                <PetProfileCard
                  item={item}
                  index={index}
                  currentIndex={currentIndex}
                  petsCount={pets.length}
                  cardHeight={cardHeight}
                  setCardHeight={setCardHeight}
                  onEdit={() => setEditModalVisible(true)}
                  onDelete={() => setDeleteModalVisible(true)}
                />
              </View>
            )}
          />
        </View>

        <TouchableOpacity style={styles.addPetButton} onPress={() => setAddModalVisible(true)}>
          <Text style={[typography.body, { color: colors.accent, fontWeight: '700' }]}>
            + Add another pet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutModalVisible(true)}
        >
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
        initialData={{
          name: currentPet?.name ?? '',
          breed: currentPet?.breed ?? '',
          weight: String(currentPet?.weight ?? ''),
          photo: currentPet?.imageUrl ?? '',
        }}
        onSave={handleEditPet}
        onClose={() => setEditModalVisible(false)}
      />

      <DeleteModal
        visible={logoutModalVisible}
        title="Log out?"
        body="You will be signed out of your account."
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={async () => {
          setLogoutModalVisible(false);
          await logoutUser();
          queryClient.clear();
          setCurrentIndex(0);
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
      />

      <DeleteModal
        visible={deleteModalVisible}
        petName={currentPet?.name ?? ''}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => {
          if (currentPet?.id != null) {
            deleteCat(currentPet.id, {
              onSettled: () => setDeleteModalVisible(false),
            });
          }
        }}
      />

      <RecognitionPromptModal
        visible={recognitionModalVisible}
        onClose={() => setRecognitionModalVisible(false)}
        onStart={() => {
          setRecognitionModalVisible(false);
          navigation.navigate('CatRecognition', {
            petNames: pets.map((p) => p.name),
            currentIndex: 0,
          });
        }}
      />
    </View>
  );
}

