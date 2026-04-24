import { useQuery, useMutation } from '@tanstack/react-query';

import { type CreatePetPayload, type Pet, type Schedule, type FeedingHistoryEntry } from '@/types';

import { api } from './api';

const getPets = async (): Promise<Pet[]> => {
  const { data } = await api.get<Pet[]>('/pets');
  return data;
};

export const createPet = async (payload: CreatePetPayload): Promise<Pet> => {
  const { data } = await api.post<Pet>('/pets', payload);
  return data;
};

export const uploadPetImage = async ({ id, uri }: { id: number; uri: string }): Promise<void> => {
  const form = new FormData();
  form.append('file', { uri, name: 'photo.jpg', type: 'image/jpeg' } as any);
  await api.post(`/pets/${id}/image`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const useGetPets = () =>
  useQuery({ queryKey: ['pets'], queryFn: getPets });

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

export const useCreatePet = () =>
  useMutation({ mutationFn: createPet });

export const updatePet = async ({ id, ...payload }: { id: number } & Partial<CreatePetPayload>): Promise<Pet> => {
  const { data } = await api.patch<Pet>(`/pets/${id}`, payload);
  return data;
};

export const useUpdatePet = () =>
  useMutation({ mutationFn: updatePet });

export const useUploadPetImage = () =>
  useMutation({ mutationFn: uploadPetImage });

export const deletePet = async (id: number): Promise<void> => {
  await api.delete(`/pets/${id}`);
};

export const useDeletePet = () =>
  useMutation({ mutationFn: deletePet });

export const togglePetSchedule = async (petId: number, isActive: boolean): Promise<void> => {
  await api.patch(`/feeding/schedules/${petId}/toggle`, { isActive });
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
