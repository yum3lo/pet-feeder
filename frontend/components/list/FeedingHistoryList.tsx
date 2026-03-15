import { StyleSheet, Text, View, TouchableOpacity, TextInput, SectionList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/style';

type FeedingEntry = { id: string; time: string; amount: string };
type FeedingSection = { title: string; data: FeedingEntry[] };

type Props = {
  sections: FeedingSection[];
  query: string;
  onQueryChange: (q: string) => void;
  onRefresh?: () => void;
};

export default function FeedingHistoryList({ sections, query, onQueryChange, onRefresh }: Props) {
  return (
    <SectionList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      sections={sections}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.stroke}
            value={query}
            onChangeText={onQueryChange}
          />
          <MaterialIcons name="search" size={22} color={colors.stroke} style={styles.searchIcon} />
        </View>
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 28,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  searchIcon: {
    marginLeft: spacing.sm,
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
});
