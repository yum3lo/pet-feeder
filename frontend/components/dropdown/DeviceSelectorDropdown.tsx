import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import DeleteModal from '@/components/modal/DeleteModal';
import { useGetDevices, deleteDevice } from '@/services/devices';
import { colors } from '@/style';
import { toCapitalize } from '@/utils';

import Dropdown from './Dropdown';

const ONLINE_COLOR = colors.success;
const OFFLINE_COLOR = colors.warning;

const deviceDotColor = (isOnline: boolean) => (isOnline ? ONLINE_COLOR : OFFLINE_COLOR);

type Props = {
  textStyle?: object | object[];
  containerStyle?: object | object[];
  style?: object;
  onDeviceChange?: (deviceId: string) => void;
  onAdd?: () => void;
};

export default function DeviceSelectorDropdown({ textStyle, containerStyle, style, onDeviceChange, onAdd }: Props) {
  const { data: devices = [] } = useGetDevices();
  const [selectedId, setSelectedId] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (devices.length > 0 && selectedId === '') {
      const initial = devices[0].deviceId;
      setSelectedId(initial);
      onDeviceChange?.(initial);
    }
  }, [devices]);

  if (devices.length === 0 || selectedId === '') return null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onDeviceChange?.(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    await deleteDevice(deletingId);
    queryClient.invalidateQueries({ queryKey: ['devices'] });
    if (selectedId === deletingId && devices.length > 1) {
      const next = devices.find((d) => d.deviceId !== deletingId);
      if (next) handleSelect(next.deviceId);
    }
    setDeletingId(null);
  };

  const deletingDevice = devices.find((d) => d.deviceId === deletingId);
  const selectedDevice = devices.find((d) => d.deviceId === selectedId) ?? devices[0];
  const displayName = toCapitalize(selectedDevice.name || selectedDevice.deviceId);

  if (devices.length === 1) {
    return (
      <>
        <View style={[styles.singleRow, containerStyle]}>
          <View style={[styles.dot, { backgroundColor: deviceDotColor(selectedDevice.isOnline) }]} />
          <Text style={textStyle}>{displayName}</Text>
          {onAdd && (
            <TouchableOpacity onPress={onAdd} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="add-circle-outline" size={22} color={colors.background} style={{ opacity: 0.75 }} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setDeletingId(selectedDevice.deviceId)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="delete-outline" size={20} color={colors.background} style={{ opacity: 0.75 }} />
          </TouchableOpacity>
        </View>

        <DeleteModal
          visible={!!deletingId}
          title="Remove device?"
          body={`This will remove "${toCapitalize(deletingDevice?.name || deletingDevice?.deviceId || '')}" from your account.`}
          confirmLabel="Remove"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingId(null)}
        />
      </>
    );
  }

  const options = devices.map((d) => ({
    label: toCapitalize(d.name || d.deviceId),
    value: d.deviceId,
    dotColor: deviceDotColor(d.isOnline),
  }));

  return (
    <>
      <View style={[styles.singleRow, containerStyle, style]}>
        <Dropdown
          options={options}
          value={selectedId}
          onSelect={handleSelect}
          compact
          light
          triggerTextStyle={textStyle}
          onDelete={setDeletingId}
        />
        {onAdd && (
          <TouchableOpacity onPress={onAdd} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="add-circle-outline" size={22} color={colors.background} style={{ opacity: 0.75 }} />
          </TouchableOpacity>
        )}
      </View>

      <DeleteModal
        visible={!!deletingId}
        title="Remove device?"
        body={`This will remove "${toCapitalize(deletingDevice?.name || deletingDevice?.deviceId || '')}" from your account.`}
        confirmLabel="Remove"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingId(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  singleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ONLINE_COLOR,
  },
});
