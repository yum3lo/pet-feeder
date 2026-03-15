import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/style';
import BottomNavBar from '@/components/nav/BottomNavBar';
import MealCard from '@/components/card/MealCard';
import { usePets } from '@/contexts/PetsContext';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('feed');
  const { pets, activePetIndex, setActivePetIndex } = usePets();
  const flatListRef = useRef<FlatList>(null);
  const [foodWeight] = useState(245); // grams 

  const navBarHeight = 12 + 26 + 4 + 18 + Math.max(insets.bottom, spacing.md);

  useEffect(() => {
    if (activePetIndex > 0 && pets.length > activePetIndex) {
      const t = setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: activePetIndex, animated: false });
      }, 50);
      return () => clearTimeout(t);
    }
  }, []);

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
        <FlatList
          ref={flatListRef}
          data={pets}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setActivePetIndex(idx);
          }}
          renderItem={({ item }) => {
            const nextMeal = item.meals.length > 0 ? item.meals[0] : null;
            return (
              <View style={{ width: SCREEN_WIDTH }}>
                <MealCard
                  catName={item.name}
                  time={nextMeal?.time ?? '—'}
                  amount={nextMeal ? parseInt(nextMeal.amount) : undefined}
                />
              </View>
            );
          }}
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
