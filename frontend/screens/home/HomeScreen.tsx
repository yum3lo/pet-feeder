import { useState, useRef, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PagingCarousel, BottomNavBar, FeedButton, MealCardWithSchedule, FoodWeightInfo } from '@/components';
import {SCREEN_WIDTH, NAVBAR_BASE} from "@/constants";
import { usePets } from '@/contexts';
import { useNotifications } from '@/hooks';
import { useGetPets } from '@/services';
import { typography, spacing } from '@/style';

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
  const carouselRef = useRef<PagingCarouselHandle>(null);
  const [foodWeight] = useState(234);

  useNotifications(foodWeight);

  useEffect(() => {
    if (activePetIndex > 0 && pets.length > activePetIndex) {
      const t = setTimeout(() => carouselRef.current?.scrollToIndex(activePetIndex), 50);
      return () => clearTimeout(t);
    }
  }, [pets.length]);

  return (
    <View style={styles.container}>
      <Text style={[typography.h3, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Smart Pet Feeder
      </Text>
      <View style={styles.content}>
        <FeedButton onPress={() => console.log('Feed pressed')} />
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
              <MealCardWithSchedule catId={item.id} catName={item.name} />
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
    </View>
  );
}


