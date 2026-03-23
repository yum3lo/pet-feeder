import { useEffect, useRef, useState } from 'react';

import { type PetData} from '@/components';
import { type PagingCarouselHandle } from '@/components/list/types';
import { useAddPet } from './useAddPet';
import { useEditPet } from './useEditPet';

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

  useEffect(() => {
    if (currentIndex > 0 && pets.length > currentIndex) {
      const t = setTimeout(() => carouselRef.current?.scrollToIndex(currentIndex), 50);
      return () => clearTimeout(t);
    }
  }, [pets.length]);

  const { handleAddPet: addPet } = useAddPet({
    petsCount: pets.length,
    carouselRef,
    setCurrentIndex,
    setRecognitionModalVisible,
  });

  const { handleEditPet: editPet } = useEditPet(pets[currentIndex]);

  const handleAddPet = (data: PetData) => { setAddModalVisible(false); addPet(data); };
  const handleEditPet = (data: PetData) => { setEditModalVisible(false); editPet(data); };

  return {
    carouselRef,
    addModalVisible, setAddModalVisible,
    editModalVisible, setEditModalVisible,
    recognitionModalVisible, setRecognitionModalVisible,
    cardHeight, setCardHeight,
    handleAddPet,
    handleEditPet,
  };
}
