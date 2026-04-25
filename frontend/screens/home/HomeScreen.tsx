import { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PagingCarousel, BottomNavBar, FeedButton, MealCardWithSchedule, FoodWeightInfo, DeviceSelectorDropdown, AddDeviceModal } from '@/components';
import {SCREEN_WIDTH, NAVBAR_BASE} from "@/constants";
import { usePets, useToast } from '@/contexts';
import { useNotifications } from '@/hooks';
import { useGetPets, manualFeed } from '@/services';
import { typography, spacing, colors } from '@/style';

import type { PagingCarouselHandle } from '@/components/list/types';
import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('feed');
  const { data: pets = [] } = useGetPets();
  const { activePetIndex, setActivePetIndex } = usePets();
  const { showToast } = useToast();
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [addDeviceVisible, setAddDeviceVisible] = useState(false);
  const carouselRef = useRef<PagingCarouselHandle>(null);
  const [foodWeight] = useState(244);

  const activePet = pets[activePetIndex];

  const handleFeed = async () => {
    if (!activePet?.id || !selectedDeviceId) return;
    try {
      await manualFeed({ petId: activePet.id, deviceId: selectedDeviceId, portionSize: 50 });
      showToast('Feeding triggered!', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to trigger feeding', 'error');
    }
  };

  useNotifications(foodWeight);

  useEffect(() => {
    if (activePetIndex > 0 && pets.length > activePetIndex) {
      const t = setTimeout(() => carouselRef.current?.scrollToIndex(activePetIndex), 50);
      return () => clearTimeout(t);
    }
  }, [pets.length]);

  return (
    <View style={styles.container}>
      <DeviceSelectorDropdown
        textStyle={[typography.h3, { color: colors.background }]}
        containerStyle={{ marginTop: insets.top + spacing.xl, marginBottom: spacing.lg, justifyContent: 'center' }}
        onDeviceChange={setSelectedDeviceId}
        onAdd={() => setAddDeviceVisible(true)}
      />
      <View style={styles.content}>
        <FeedButton onPress={handleFeed} />
        <FoodWeightInfo grams={foodWeight} />
      </View>

      <View style={[styles.mealCardContainer, { bottom: NAVBAR_BASE + Math.max(insets.bottom, spacing.md) }]}>
        <PagingCarousel
          ref={carouselRef}
          data={pets}
          keyExtractor={(item) => String(item.id)}
          itemWidth={SCREEN_WIDTH}
          onIndexChange={setActivePetIndex}
          renderItem={(item) => (
            <View style={{ width: SCREEN_WIDTH }}>
              <MealCardWithSchedule petId={item.id} petName={item.name} />
            </View>
          )}
        />
      </View>

      <BottomNavBar
        activeTab={activeTab}
        onTabPress={(key) => {
          setActiveTab(key);
          if (key === 'schedule') navigation.navigate('Schedule');
          if (key === 'history') navigation.navigate('History');
          if (key === 'settings') navigation.navigate('Settings');
        }}
      />

      <AddDeviceModal visible={addDeviceVisible} onClose={() => setAddDeviceVisible(false)} />
    </View>
  );
}


