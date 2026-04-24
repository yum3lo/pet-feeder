import { useQuery, useMutation } from '@tanstack/react-query';

import { type CreatePetPayload, type Pet } from '@/types';

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
