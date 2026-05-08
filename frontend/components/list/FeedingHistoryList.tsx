import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SectionList } from 'react-native';

import { DateFilterPicker } from '@/components';
import { colors, typography, spacing } from '@/style';

import type { FeedingProps } from './types';

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completed', color: '#34C759' },
  failed:    { label: 'Failed',    color: '#FF3B30' },
  pending:   { label: 'Pending',   color: '#FF9500' },
};

const TYPE_LABELS: Record<string, { icon: string; label: string }> = {
  scheduled: { icon: 'schedule', label: 'Scheduled feeding' },
  manual:    { icon: 'touch-app', label: 'Manual feeding' },
  free: { icon: 'videocam', label: 'Recognition-triggered feeding' },
};

export default function FeedingHistoryList({ sections, selectedDate, onSelectDate, markedDates, onRefresh }: FeedingProps) {
  const [tooltipId, setTooltipId] = useState<string | null>(null);
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
      renderItem={({ item, index, section }) => {
        const type = item.feedingType ?? 'manual';
        const { icon, label } = TYPE_LABELS[type] ?? TYPE_LABELS.manual;
        const isTooltipVisible = tooltipId === item.id;
        return (
          <>
            <View style={styles.entryRow}>
              <View style={styles.entryLeft}>
                <View>
                  <TouchableOpacity
                    onPress={() => setTooltipId(isTooltipVisible ? null : item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialIcons name={icon as any} size={18} color={isTooltipVisible ? colors.accent : colors.stroke} style={{ marginRight: spacing.sm }} />
                  </TouchableOpacity>
                  {isTooltipVisible && (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>{label}</Text>
                    </View>
                  )}
                </View>
                <View>
                  <Text style={[typography.bodySmall, { color: colors.stroke }]}>
                    {item.time} · {item.amount}
                    {item.status ? (
                      <Text style={{ fontWeight: '700', color: (STATUS_STYLES[item.status] ?? STATUS_STYLES.pending).color }}>
                        {'  '}{(STATUS_STYLES[item.status] ?? STATUS_STYLES.pending).label}
                      </Text>
                    ) : null}
                  </Text>
                </View>
              </View>
              <Text style={[typography.bodySmall, { color: colors.inactive }]}>
                {item.deviceName}
              </Text>
            </View>
            {index < section.data.length - 1 && <View style={styles.divider} />}
          </>
        );
      }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tooltip: {
    position: 'absolute',
    top: 24,
    left: 0,
    backgroundColor: colors.text,
    borderRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    zIndex: 10,
    minWidth: 120,
  },
  tooltipText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '500',
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
