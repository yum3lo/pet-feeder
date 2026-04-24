import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, SectionList } from 'react-native';

import { DateFilterPicker } from '@/components';
import { colors, typography, spacing } from '@/style';

import type { FeedingProps } from './types';

export default function FeedingHistoryList({ sections, selectedDate, onSelectDate, markedDates, onRefresh }: FeedingProps) {
  return (
    <SectionList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      sections={sections}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <DateFilterPicker
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          markedDates={markedDates}
        />
      }
      ListEmptyComponent={
        selectedDate ? (
          <Text style={[typography.bodySmall, styles.empty]}>
            No feeding records for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
          </Text>
        ) : null
      }
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={[typography.bodyBold, { color: colors.stroke }]}>{section.title}</Text>
          {section === sections[0] && onRefresh && (
            <TouchableOpacity onPress={onRefresh} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="refresh" size={22} color={colors.stroke} />
            </TouchableOpacity>
          )}
        </View>
      )}
      renderSectionFooter={() => <View style={styles.sectionFooter} />}
      renderItem={({ item, index, section }) => (
        <>
          <View style={styles.entryRow}>
            <Text style={[typography.bodySmall, { color: colors.stroke }]}>
              {item.time} - {item.amount}
            </Text>
          </View>
          {index < section.data.length - 1 && <View style={styles.divider} />}
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  entryRow: {
    paddingVertical: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outline,
  },
  sectionFooter: {
    height: spacing.lg,
  },
  empty: {
    color: colors.stroke,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
