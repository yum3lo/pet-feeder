import { useQueryClient } from '@tanstack/react-query';

import { useOfflineQueue, useSharedNetworkStatus, useToast } from '@/contexts';
import { useDeletePet as useDeletePetMutation } from '@/services';

import type { Pet } from '@/types';

export function useDeletePet() {
  const { mutate: deletePet } = useDeletePetMutation();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { enqueue } = useOfflineQueue();
  const { isOnline } = useSharedNetworkStatus();

  const handleDeletePet = (pet: Pet, onRevert?: () => void) => {
    const previous = queryClient.getQueryData<Pet[]>(['pets']) ?? [];
    const newPets = previous.filter((p) => p.id !== pet.id);

    queryClient.setQueryData<Pet[]>(['pets'], newPets);

    if (!isOnline) {
      enqueue({ type: 'deletePet', payload: { id: pet.id } });
      showToast('No connection — deletion will sync when back online', 'error');
      return;
    }

    deletePet(pet.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pets'] });
        showToast('Pet deleted', 'success');
      },
      onError: (err: any) => {
        queryClient.setQueryData<Pet[]>(['pets'], previous);
        onRevert?.();
        showToast(err?.response?.data?.message ?? 'Failed to delete pet', 'error');
      },
    });
  };

  return { handleDeletePet };
}
