import { useQueryClient } from '@tanstack/react-query';
import { type MutableRefObject } from 'react';

import { type PetData } from '@/components';
import { type PagingCarouselHandle } from '@/components/list/types';
import { useOfflineQueue, useSharedNetworkStatus, useToast } from '@/contexts';
import { useCreatePet, useUploadPetImage } from '@/services';
import { toCreatePayload } from '@/utils';

type Params = {
  petsCount: number;
  carouselRef: MutableRefObject<PagingCarouselHandle | null>;
  setCurrentIndex: (index: number) => void;
  setRecognitionModalVisible: (v: boolean) => void;
};

export function useAddPet({ petsCount, carouselRef, setCurrentIndex, setRecognitionModalVisible }: Params) {
  const { mutate: createPet } = useCreatePet();
  const { mutate: uploadImage } = useUploadPetImage();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { enqueue } = useOfflineQueue();
  const { isOnline } = useSharedNetworkStatus();

  const handleAddPet = (data: PetData) => {
    const payload = toCreatePayload(data);

    if (!isOnline) {
      enqueue({ type: 'createPet', payload });
      showToast('No connection — pet will sync when back online', 'error');
      return;
    }

    const { photo, ...petPayload } = payload;
    createPet(petPayload, {
      onSuccess: (pet) => {
        showToast(`${data.name} added!`, 'success');
        const finish = () => {
          queryClient.invalidateQueries({ queryKey: ['pets'] });
          setTimeout(() => {
            carouselRef.current?.scrollToIndex(petsCount, true);
            setCurrentIndex(petsCount);
            if (petsCount + 1 >= 2) setRecognitionModalVisible(true);
          }, 100);
        };
        if (photo) {
          uploadImage({ id: pet.id, uri: photo }, { onSuccess: finish, onError: finish });
        } else {
          finish();
        }
      },
      onError: (err: any) => {
        if (!err?.response) {
          enqueue({ type: 'createPet', payload });
          showToast('No connection — pet will sync when back online', 'error');
        } else {
          showToast(err?.response?.data?.message ?? 'Failed to add pet', 'error');
        }
      },
    });
  };

  return { handleAddPet };
}
