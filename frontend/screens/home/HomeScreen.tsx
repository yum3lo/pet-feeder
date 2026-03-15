import { MaterialIcons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PagingCarousel, BottomNavBar, MealCard } from '@/components';
import { usePets } from '@/contexts';
import { useGetPets, useGetCatSchedules } from '@/services';
import { colors, typography, spacing } from '@/style';

import type { PagingCarouselHandle } from '@/components/list/types';
import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function MealCardWithSchedule({ catId, catName }: { catId: number; catName: string }) {
  const { data: schedules = [] } = useGetCatSchedules(catId);
  const nextMeal = schedules.length > 0 ? schedules[0] : null;
  return (
    <MealCard
      catName={catName}
      time={nextMeal?.time ?? '—'}
      amount={nextMeal?.amount}
    />
  );
}

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('feed');
  const { data: pets = [] } = useGetPets();
  const { activePetIndex, setActivePetIndex } = usePets();
  const carouselRef = useRef<PagingCarouselHandle>(null);
  const [foodWeight] = useState(245); //grams

  const navBarHeight = 12 + 26 + 4 + 18 + Math.max(insets.bottom, spacing.md);

  return (
    <View style={styles.container}>
      <Text style={[typography.h3, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Smart Pet Feeder
      </Text>
      <View style={styles.content}>
        <TouchableOpacity style={styles.feedButton} onPress={() => console.log('Feed pressed')}>
             <MaterialIcons
              name="pets"
              size={96}
              color={colors.accent}
            />
          <Text style={styles.feedText}>Feed</Text>
        </TouchableOpacity>

        <View style={styles.weightInfo}>
          <Text style={[typography.h3, styles.weightValue]}>{foodWeight}g</Text>
          <Text style={[typography.bodySmall, styles.weightLabel]}>Food weight</Text>
        </View>
      </View>

      <View style={[styles.mealCardContainer, { bottom: navBarHeight }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  title: {
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xl,
  },
  weightInfo: {
    alignItems: 'center',
  },
  weightValue: {
    color: colors.background,
    fontWeight: '700',
  },
  weightLabel: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  mealCardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  feedButton: {
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
  feedText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
});
