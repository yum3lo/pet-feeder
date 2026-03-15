import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/style';
import BottomNavBar from '@/components/nav/BottomNavBar';
import FeedingHistoryList from '@/components/FeedingHistoryList';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

type FeedingEntry = { id: string; time: string; amount: string };
type FeedingSection = { title: string; data: FeedingEntry[] };

const MOCK_DATA: FeedingSection[] = [
  {
    title: '10th of March 2025',
    data: [
      { id: '1', time: '10:00', amount: '150 g' },
      { id: '2', time: '17:00', amount: '150 g' },
    ],
  },
  {
    title: '9th of March 2025',
    data: [
      { id: '3', time: '10:00', amount: '150 g' },
      { id: '4', time: '17:00', amount: '150 g' },
    ],
  },
  {
    title: '8th of March 2025',
    data: [
      { id: '5', time: '10:00', amount: '150 g' },
      { id: '6', time: '17:00', amount: '150 g' },
    ],
  },
  {
    title: '7th of March 2025',
    data: [
      { id: '7', time: '10:00', amount: '150 g' },
      { id: '8', time: '17:00', amount: '150 g' },
    ],
  },
];

export default function HistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? MOCK_DATA.map((section) => ({
        ...section,
        data: section.data.filter(
          (e) => e.time.includes(query) || e.amount.includes(query) || section.title.toLowerCase().includes(query.toLowerCase())
        ),
      })).filter((s) => s.data.length > 0)
    : MOCK_DATA;

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Feeding History
      </Text>

      <FeedingHistoryList
        sections={filtered}
        query={query}
        onQueryChange={setQuery}
        onRefresh={() => {}}
      />

      <BottomNavBar
        activeTab="history"
        onTabPress={(key) => {
          if (key === 'feed') navigation.navigate('Home');
          if (key === 'schedule') navigation.navigate('Schedule');
          if (key === 'settings') navigation.navigate('Settings');
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
    marginBottom: spacing.xl,
  },
});
