import { useState } from 'react';

import { useToast, useSharedNetworkStatus, useOfflineQueue } from '@/contexts';
import { useCreatePet } from '@/services';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

export function usePetForm(navigation: NavigationProp<RootStackParamList>) {
  const [pet, setPet] = useState({ petName: '', petWeight: '', petBreed: '', petSpecies: '' });
  const { mutate: createPet, isPending } = useCreatePet();
  const { showToast } = useToast();
  const { enqueue } = useOfflineQueue();
  const { isOnline } = useSharedNetworkStatus();

  const handleSubmit = () => {
    if (!isOnline) {
      enqueue({ type: 'createPet', payload: { name: pet.petName, weight: parseFloat(pet.petWeight), breed: pet.petBreed, species: pet.petSpecies } });
      showToast('No connection — pet will sync when back online', 'error');
      return;
    }

    createPet(
      { name: pet.petName, weight: parseFloat(pet.petWeight), breed: pet.petBreed, species: pet.petSpecies },
      {
        onSuccess: (created) => navigation.navigate('AddPetPhoto', { petId: created.id }),
        onError: (err: any) => {
          if (!err?.response) {
            enqueue({ type: 'createPet', payload: { name: pet.petName, weight: parseFloat(pet.petWeight), breed: pet.petBreed, species: pet.petSpecies } });
            showToast('No connection — pet will sync when back online', 'error');
          } else {
            showToast(err?.response?.data?.message ?? 'Failed to add pet', 'error');
          }
        },
      },
    );
  };

  return { pet, setPet, isPending, handleSubmit };
}
