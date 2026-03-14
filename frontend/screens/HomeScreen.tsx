import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/style';
import BottomNavBar from '@/components/BottomNavBar';
import MealCard from '@/components/MealCard';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';


type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('feed');

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
      </View>
      <MealCard />
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
