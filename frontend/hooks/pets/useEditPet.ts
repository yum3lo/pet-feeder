import { useQueryClient } from '@tanstack/react-query';

import { type PetData } from '@/components';
import { useOfflineQueue, useSharedNetworkStatus, useToast } from '@/contexts';
import { useUpdateCat, useUploadPetImage } from '@/services';
import { toUpdatePayload, toCapitalize } from '@/utils';

import type { Pet } from '@/types';

export function useEditPet(currentPet: Pet | undefined) {
  const { mutate: updateCat } = useUpdateCat();
  const { mutate: uploadImage } = useUploadPetImage();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { enqueue } = useOfflineQueue();
  const { isOnline } = useSharedNetworkStatus();

  const handleEditPet = (data: PetData) => {
    if (currentPet == null) return;

    const updateFields = toUpdatePayload(data, currentPet.imageUrl);
    const { photo, ...petPayload } = updateFields;

    if (!isOnline) {
      enqueue({ type: 'updatePet', payload: { id: currentPet.id, ...updateFields } });
      showToast('No connection — changes will sync when back online', 'error', 'bottom');
      return;
    }

    updateCat(
      { id: currentPet.id, ...petPayload },
      {
        onSuccess: () => {
          showToast(`${toCapitalize(data.name)} updated!`, 'success', 'bottom');
          if (photo) {
            uploadImage(
              { id: currentPet.id, uri: photo },
              { onSettled: () => queryClient.invalidateQueries({ queryKey: ['cats'] }) },
            );
          } else {
            queryClient.invalidateQueries({ queryKey: ['cats'] });
          }
        },
        onError: (err: any) => {
          if (!err?.response) {
            enqueue({ type: 'updatePet', payload: { id: currentPet.id, ...updateFields } });
            showToast('No connection — changes will sync when back online', 'error', 'bottom');
          } else {
            showToast(err?.response?.data?.message ?? 'Failed to update pet', 'error');
          }
        },
      },
    );
  };

  return { handleEditPet };
}
