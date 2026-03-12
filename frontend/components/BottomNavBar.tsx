import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../style';

const navItems = [
  { key: 'feed', icon: 'pets' as const, label: 'Feed' },
  { key: 'schedule', icon: 'event-note' as const, label: 'Schedule' },
  { key: 'history', icon: 'history' as const, label: 'History' },
  { key: 'settings', icon: 'settings' as const, label: 'Settings' },
];

type Props = {
  activeTab: string;
  onTabPress: (key: string) => void;
};

export default function BottomNavBar({ activeTab, onTabPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.navBar, { paddingBottom: insets.bottom || spacing.md }]}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.navItem}
          onPress={() => onTabPress(item.key)}
        >
          <MaterialIcons
            name={item.icon}
            size={26}
            color={activeTab === item.key ? colors.accent : colors.inactive}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === item.key && { color: colors.accent },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.inactive,
  },
});
