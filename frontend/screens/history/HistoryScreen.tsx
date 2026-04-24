import { useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavBar, FeedingHistoryList, PetSelectorDropdown } from '@/components';
import { usePets } from '@/contexts';
import { useGetFeedingHistory } from '@/services';
import { colors, typography, spacing } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

function formatSectionTitle(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { pets, activePetIndex } = usePets();
  const activePet = pets[activePetIndex];

  const { data: entries = [], isLoading, refetch } = useGetFeedingHistory(
    activePet ? Number(activePet.id) : undefined,
  );

  // TODO: remove mock
  const MOCK_ENTRIES = [{ id: '1', date: '2026-03-27', feedings: [{ time: '10:00', amount: 80 }, { time: '17:00', amount: 80 }] }];

  const sections = (entries.length ? entries : MOCK_ENTRIES).map((e) => ({
    title: formatSectionTitle(e.date),
    date: e.date,
    data: e.feedings.map((f, idx) => ({
      id: `${e.id}-${idx}`,
      time: f.time,
      amount: `${f.amount} g`,
    })),
  }));

  const markedDates: Record<string, object> = {};
  sections.forEach((s) => {
    markedDates[s.date] = { marked: true, dotColor: colors.accent };
  });

  const filtered = selectedDate
    ? sections.filter((s) => s.date === selectedDate)
    : sections;

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title, { marginTop: insets.top + spacing.xl }]}>
        Feeding History
      </Text>

      <PetSelectorDropdown style={styles.petDropdown} />

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={[typography.bodyBold, { color: colors.accent, marginTop: spacing.md }]}>
            Loading history logs...
          </Text>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.loadingState}>
          <Text style={[typography.bodyBold, { color: colors.stroke }]}>No feeding history yet.</Text>
          <Text style={[typography.bodySmall, { color: colors.stroke, marginTop: spacing.xs, textAlign: 'center' }]}>
            Feeding events will appear here once your pet has been fed.
          </Text>
        </View>
      ) : (
        <FeedingHistoryList
          sections={filtered}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markedDates={markedDates}
          onRefresh={refetch}
        />
      )}

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
