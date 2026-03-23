import { useQueryClient } from '@tanstack/react-query';

import { useOfflineQueue, useSharedNetworkStatus, useToast } from '@/contexts';
import { useDeleteCat } from '@/services';

import type { Pet } from '@/types';

export function useDeletePet() {
  const { mutate: deleteCat } = useDeleteCat();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { enqueue } = useOfflineQueue();
  const { isOnline } = useSharedNetworkStatus();

  const handleDeletePet = (pet: Pet, onRevert?: () => void) => {
    const previous = queryClient.getQueryData<Pet[]>(['cats']) ?? [];
    const newPets = previous.filter((p) => p.id !== pet.id);

    queryClient.setQueryData<Pet[]>(['cats'], newPets);

    if (!isOnline) {
      enqueue({ type: 'deletePet', payload: { id: pet.id } });
      showToast('No connection — deletion will sync when back online', 'error', 'bottom');
      return;
    }

    deleteCat(pet.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cats'] });
      },
      onError: (err: any) => {
        queryClient.setQueryData<Pet[]>(['cats'], previous);
        onRevert?.();
        showToast(err?.response?.data?.message ?? 'Failed to delete pet', 'error');
      },
    });
  };

  return { handleDeletePet };
}
