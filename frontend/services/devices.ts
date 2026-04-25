import { useQuery } from '@tanstack/react-query';

import { api } from './api';

export interface Device {
  id: number;
  deviceId: string;
  name: string | null;
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
}

export const registerDevice = async (payload: { deviceId: string; name: string }): Promise<void> => {
  await api.post('/devices/register', payload);
};

export const useGetDevices = () =>
  useQuery<Device[]>({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data } = await api.get<Device[]>('/devices');
      return data;
    },
  });

export const useGetDeviceById = (deviceId: string | undefined) =>
  useQuery<Device>({
    queryKey: ['device', deviceId],
    queryFn: async () => {
      const { data } = await api.get<Device>(`/devices/${deviceId}`);
      return data;
    },
    enabled: !!deviceId,
    staleTime: 60_000,
  });

export const manualFeed = async (payload: {
  petId: number;
  deviceId: string;
  portionSize: number;
}): Promise<void> => {
  await api.post('/feeding/manual', payload);
};

export const deleteDevice = async (deviceId: string): Promise<void> => {
  await api.delete(`/devices/${deviceId}`);
};
