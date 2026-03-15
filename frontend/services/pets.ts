import { useQuery, useMutation } from '@tanstack/react-query';

import { type CreatePetPayload, type Pet, type Schedule} from '@/types';

import { api } from './api';

const getPets = async (): Promise<Pet[]> => {
  const { data } = await api.get<Pet[]>('/cats');
  return data;
};

const createPet = async (payload: CreatePetPayload): Promise<Pet> => {
  const { data } = await api.post<Pet>('/cats', payload);
  return data;
};

const uploadPetImage = async ({ id, uri }: { id: number; uri: string }): Promise<void> => {
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
  });

export const useCreateCat = () =>
  useMutation({ mutationFn: createPet });

export const useUploadPetImage = () =>
  useMutation({ mutationFn: uploadPetImage });
