import { useQuery } from '@tanstack/react-query';

import { api } from './api';

export interface Device {
  id: number;
  deviceId: string;
  name: string | null;
  isOnline: boolean;
  lastSeen: string | null;
  containerWeight: number | null;
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
    refetchInterval: 10_000,
  });

export const useGetDeviceById = (deviceId: string | undefined) =>
  useQuery<Device>({
    queryKey: ['device', deviceId],
    queryFn: async () => {
      const { data } = await api.get<Device>(`/devices/${deviceId}`);
      return data;
    },
    enabled: !!deviceId,
    refetchInterval: 10_000,
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

export const trainModel = async (deviceId: string): Promise<{ success: boolean; accuracy: number; numClasses: number; classNames: string[]; modelPath: string }> => {
  const { data } = await api.post(`/feeding/train/${deviceId}`, undefined, { timeout: 300000 });
  return data;
};

export const capturePhotos = async (deviceId: string, petId: number): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>('/feeding/capture-photos', { deviceId, petId });
  return data;
};

export const captureBackground = async (deviceId: string): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>('/feeding/capture-background', {
    deviceId,
    petId: 0,
  });
  return data;
};
