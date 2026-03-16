import { useState } from 'react';

import { useToast } from '@/contexts';
import { useCreateCat } from '@/services';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

export function usePetForm(navigation: NavigationProp<RootStackParamList>) {
  const [pet, setPet] = useState({ petName: '', petWeight: '', petBreed: '' });
  const { mutate: createPet, isPending } = useCreateCat();
  const { showToast } = useToast();

  const handleSubmit = () => {
    createPet(
      { name: pet.petName, weight: parseFloat(pet.petWeight), breed: pet.petBreed },
      {
        onSuccess: (created) => navigation.navigate('AddPetPhoto', { petId: created.id }),
        onError: (err: any) =>
          showToast(err?.response?.data?.message ?? 'Failed to add pet', 'error'),
      },
    );
  };

  return { pet, setPet, isPending, handleSubmit };
}
