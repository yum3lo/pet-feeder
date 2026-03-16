import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { type PetData } from '@/components';
import { useToast } from '@/contexts';
import { useCreateCat, useUploadPetImage } from '@/services';

import type { PagingCarouselHandle } from '@/components/list/types';
import type { Pet } from '@/types';

type Params = {
  pets: Pet[];
  setCurrentIndex: (index: number) => void;
  currentIndex: number;
};

export function useSettingsPets({ pets, currentIndex, setCurrentIndex }: Params) {
  const carouselRef = useRef<PagingCarouselHandle>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [recognitionModalVisible, setRecognitionModalVisible] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  const { mutate: createCat } = useCreateCat();
  const { mutate: uploadImage } = useUploadPetImage();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    if (currentIndex > 0 && pets.length > currentIndex) {
      const t = setTimeout(() => carouselRef.current?.scrollToIndex(currentIndex), 50);
      return () => clearTimeout(t);
    }
  }, [pets.length]);

  const handleAddPet = (data: PetData) => {
    setAddModalVisible(false);
    createCat(
      {
        name: data.name,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        breed: data.breed || undefined,
      },
      {
        onSuccess: (cat) => {
          const finish = () => {
            queryClient.invalidateQueries({ queryKey: ['cats'] });
            setTimeout(() => {
              const newIndex = pets.length;
              carouselRef.current?.scrollToIndex(newIndex, true);
              setCurrentIndex(newIndex);
              if (pets.length + 1 >= 2) setRecognitionModalVisible(true);
            }, 100);
          };
          if (data.photo) {
            uploadImage({ id: cat.id, uri: data.photo }, { onSuccess: finish, onError: finish });
          } else {
            finish();
          }
        },
        onError: (err: any) =>
          showToast(err?.response?.data?.message ?? 'Failed to add pet', 'error'),
      },
    );
  };

  const handleEditPet = (_data: PetData) => {
    setEditModalVisible(false);
  };

  return {
    carouselRef,
    addModalVisible,
    setAddModalVisible,
    editModalVisible,
    setEditModalVisible,
    recognitionModalVisible,
    setRecognitionModalVisible,
    cardHeight,
    setCardHeight,
    handleAddPet,
    handleEditPet,
  };
}
