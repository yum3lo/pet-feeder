import { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PagingCarousel, BottomNavBar, FeedButton, MealCardWithSchedule, FoodWeightInfo, DeviceSelectorDropdown, AddDeviceModal, Stepper } from '@/components';
import {SCREEN_WIDTH, NAVBAR_BASE} from "@/constants";
import { usePets, useToast } from '@/contexts';
import { useNotifications } from '@/hooks';
import { useGetPets, manualFeed } from '@/services';
import { useGetDevices } from '@/services/devices';
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
  const [portionSize, setPortionSize] = useState(50);
  const PORTION_STEP = 10;
  const MIN_PORTION = 10;
  const MAX_PORTION = 300;

  const { data: devices = [] } = useGetDevices();
  const activePet = pets[activePetIndex];
  const selectedDevice = devices.find((d) => d.deviceId === selectedDeviceId) ?? devices[0];
  const foodWeight = selectedDevice?.containerWeight ?? 0;

  const handleFeed = async () => {
    if (!activePet?.id || !selectedDeviceId) return;
    try {
      await manualFeed({ petId: activePet.id, deviceId: selectedDeviceId, portionSize });
      showToast('Feeding triggered!', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to trigger feeding', 'error');
    }
  };

  useNotifications();

  useEffect(() => {
    if (pets.length > activePetIndex) {
      const t = setTimeout(() => carouselRef.current?.scrollToIndex(activePetIndex), 50);
      return () => clearTimeout(t);
    }
  }, [activePetIndex, pets.length]);

  const MEAL_CARDS_GAP = 28;
  const MEAL_CARD_WIDTH = pets.length > 1 ? SCREEN_WIDTH - MEAL_CARDS_GAP : SCREEN_WIDTH;

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
        <Stepper
          label="Portion size"
          value={portionSize}
          onChange={setPortionSize}
          step={PORTION_STEP}
          min={MIN_PORTION}
          max={MAX_PORTION}
          iconColor={colors.background}
          labelStyle={{ color: colors.background, fontSize: 16, fontWeight: '600' }}
          valueStyle={{ color: colors.background }}
          btnStyle={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)' }}
          style={{ width: '80%' }}
        />
      </View>

      <View style={[styles.mealCardContainer, { bottom: NAVBAR_BASE + Math.max(insets.bottom, spacing.md) }]}>
        <PagingCarousel
          ref={carouselRef}
          data={pets}
          keyExtractor={(item) => String(item.id)}
          itemWidth={ MEAL_CARD_WIDTH }
          onIndexChange={setActivePetIndex}
          renderItem={(item, index) => (
            <View style={{ width: MEAL_CARD_WIDTH }}>
              <MealCardWithSchedule
                petId={item.id}
                petName={item.name}
                cardStyle={pets.length > 1 ? { marginLeft: index === 0 ? 16 : 8, marginRight: index === pets.length - 1 ? 16 : 8 } : undefined}
              />
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


