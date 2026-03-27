import { useQuery, useMutation } from '@tanstack/react-query';

import { type CreatePetPayload, type Pet, type Schedule, type FeedingHistoryEntry } from '@/types';

import { api } from './api';

const getPets = async (): Promise<Pet[]> => {
  const { data } = await api.get<Pet[]>('/cats');
  return data;
};

export const createPet = async (payload: CreatePetPayload): Promise<Pet> => {
  const { data } = await api.post<Pet>('/cats', payload);
  return data;
};

export const uploadPetImage = async ({ id, uri }: { id: number; uri: string }): Promise<void> => {
  const form = new FormData();
  form.append('image', { uri, name: 'photo.jpg', type: 'image/jpeg' } as any);
  await api.post(`/cats/${id}/image`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const useGetPets = () =>
  useQuery({ queryKey: ['cats'], queryFn: getPets });

const getCatSchedules = async (catId: number): Promise<Schedule[]> => {
  const { data } = await api.get<Schedule[]>(`/pet-feeder/cats/${catId}/schedules`);
  return data;
};

export const useGetCatSchedules = (catId: number | undefined) =>
  useQuery({
    queryKey: ['schedules', catId],
    queryFn: () => getCatSchedules(catId!),
    enabled: catId != null,
    staleTime: 30_000,
  });

export const useCreateCat = () =>
  useMutation({ mutationFn: createPet });

export const updatePet = async ({ id, ...payload }: { id: number } & Partial<CreatePetPayload>): Promise<Pet> => {
  const { data } = await api.put<Pet>(`/cats/${id}`, payload);
  return data;
};

export const useUpdateCat = () =>
  useMutation({ mutationFn: updatePet });

export const useUploadPetImage = () =>
  useMutation({ mutationFn: uploadPetImage });

export const deletePet = async (id: number): Promise<void> => {
  await api.delete(`/cats/${id}`);
};

export const useDeleteCat = () =>
  useMutation({ mutationFn: deletePet });

export const toggleCatSchedule = async (catId: number, isActive: boolean): Promise<void> => {
  await api.patch(`/pet-feeder/cats/${catId}/toggle`, { isActive });
};

const getFeedingHistory = async (catId: number): Promise<FeedingHistoryEntry[]> => {
  const { data } = await api.get<FeedingHistoryEntry[]>(`/pet-feeder/cats/${catId}/feeding-history`);
  return data;
};

export const useGetFeedingHistory = (catId: number | undefined) =>
  useQuery({
    queryKey: ['feeding-history', catId],
    queryFn: () => getFeedingHistory(catId!),
    enabled: catId != null,
    staleTime: 30_000,
  });

// TODO: replace with real API call when the endpoint is ready ─────────────
export type PetScheduleEntry = { petName: string; time: string };

export const getMockAllSchedules = async (): Promise<PetScheduleEntry[]> => [
  { petName: 'Pookie', time: '21:57' },
  { petName: 'Pookie', time: '17:00' },
];
