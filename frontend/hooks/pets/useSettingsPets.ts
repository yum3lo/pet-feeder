import { useEffect, useRef, useState } from 'react';

import { type PetData} from '@/components';
import { type PagingCarouselHandle } from '@/components/list/types';

import type { Pet } from '@/types';

import { useAddPet } from './useAddPet';
import { useDeletePet } from './useDeletePet';
import { useEditPet } from './useEditPet';

type Params = {
  pets: Pet[];
  setCurrentIndex: (index: number) => void;
  currentIndex: number;
};

export function useSettingsPets({ pets, currentIndex, setCurrentIndex }: Params) {
  const carouselRef = useRef<PagingCarouselHandle>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
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
  const { handleDeletePet: deletePet } = useDeletePet();

  const handleAddPet = (data: PetData) => { setAddModalVisible(false); addPet(data); };
  const handleEditPet = (data: PetData) => { setEditModalVisible(false); editPet(data); };
  const handleDeletePet = (pet: Pet) => {
    setDeleteModalVisible(false);
    const newPets = pets.filter((p) => p.id !== pet.id);
    const newIndex = newPets.length > 0 ? Math.min(currentIndex, newPets.length - 1) : 0;
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    if (newPets.length > 0) {
      setTimeout(() => carouselRef.current?.scrollToIndex(newIndex), 50);
    }
    deletePet(pet, () => {
      setTimeout(() => carouselRef.current?.scrollToIndex(currentIndex), 50);
    });
  };

  return {
    carouselRef,
    addModalVisible, setAddModalVisible,
    editModalVisible, setEditModalVisible,
    deleteModalVisible, setDeleteModalVisible,
    recognitionModalVisible, setRecognitionModalVisible,
    cardHeight, setCardHeight,
    handleAddPet,
    handleEditPet,
    handleDeletePet,
  };
}
