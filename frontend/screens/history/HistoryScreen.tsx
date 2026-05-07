import { useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavBar, FeedingHistoryList, PetSelectorDropdown } from '@/components';
import { usePets } from '@/contexts';
import { useGetFeedingHistory, useGetPets } from '@/services';
import { useGetDevices } from '@/services/devices';
import { colors, typography, spacing } from '@/style';
import { toCapitalize } from '@/utils';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

function formatSectionTitle(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isoToDate(iso: string): string {
  return iso.slice(0, 10); // "YYYY-MM-DD"
}

function isoToTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function HistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { activePetIndex } = usePets();
  const { data: pets = [] } = useGetPets();
  const activePet = pets[activePetIndex];

  const { data: entries = [], isLoading, refetch } = useGetFeedingHistory(
    activePet ? Number(activePet.id) : undefined,
  );
  const { data: devices = [], isLoading: isDevicesLoading } = useGetDevices();

  const getDeviceName = (deviceId: string) => {
    const device = devices.find((d) => d.deviceId === deviceId);
    return toCapitalize(device?.name || deviceId);
  };

  const grouped: Record<string, { title: string; date: string; data: { id: string; time: string; amount: string; deviceName: string; petName?: string; feedingType?: string; status?: string }[] }> = {};

  entries.forEach((e) => {
    const date = isoToDate(e.timestamp);
    if (!grouped[date]) {
      grouped[date] = { title: formatSectionTitle(e.timestamp), date, data: [] };
    }
    grouped[date].data.push({
      id: String(e.id),
      time: isoToTime(e.timestamp),
      amount: `${e.consumedGrams} g`,
      deviceName: getDeviceName(e.deviceId),
      petName: (e as any).pet?.name,
      feedingType: (e as any).feedingType,
      status: e.status,
    });
  });

  const sections = Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));

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

      {isLoading || isDevicesLoading ? (
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
