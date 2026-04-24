import { useQuery } from '@tanstack/react-query';

import { type Schedule, type FeedingHistoryEntry } from '@/types';

import { api } from './api';

const getPetSchedules = async (petId: number): Promise<Schedule[]> => {
  const { data } = await api.get<Schedule[]>(`/feeding/schedules/pet/${petId}`);
  return data;
};

export const useGetPetSchedules = (petId: number | undefined) =>
  useQuery({
    queryKey: ['schedules', petId],
    queryFn: () => getPetSchedules(petId!),
    enabled: petId != null,
    staleTime: 30_000,
  });

export const togglePetSchedule = async (scheduleId: number, isActive: boolean): Promise<void> => {
  await api.patch(`/feeding/schedules/${scheduleId}/toggle`, { isActive });
};

export const createSchedule = async (payload: {
  petId: number;
  time: string;
  portionSize: number;
  deviceId?: string;
}): Promise<void> => {
  await api.post('/feeding/schedules', { ...payload, feedingMode: 'scheduled', deviceId: payload.deviceId ?? 'feeder_01' });
};

export const updateSchedule = async (scheduleId: number, payload: { time: string; portionSize: number }): Promise<void> => {
  await api.patch(`/feeding/schedules/${scheduleId}`, payload);
};

export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  await api.delete(`/feeding/schedules/${scheduleId}`);
};

const getFeedingHistory = async (petId: number): Promise<FeedingHistoryEntry[]> => {
  const { data } = await api.get<FeedingHistoryEntry[]>(`/feeding/history?petId=${petId}`);
  return data;
};

export const useGetFeedingHistory = (petId: number | undefined) =>
  useQuery({
    queryKey: ['feeding-history', petId],
    queryFn: () => getFeedingHistory(petId!),
    enabled: petId != null,
    staleTime: 30_000,
  });

// TODO: replace with real API call when the endpoint is ready ─────────────
export type PetScheduleEntry = { petName: string; time: string };

export const getMockAllSchedules = async (): Promise<PetScheduleEntry[]> => [
  { petName: 'Pookie', time: '21:57' },
  { petName: 'Pookie', time: '17:00' },
];
