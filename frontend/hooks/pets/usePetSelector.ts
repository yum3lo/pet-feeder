import { useState } from 'react';

import { usePets } from '@/contexts';
import { useGetPets } from '@/services';
import { toCapitalize } from '@/utils';

export function usePetSelector() {
  const { pets, activePetIndex, setActivePetIndex } = usePets();
  const { data: apiPets = [] } = useGetPets();

  const [selectedId, setSelectedId] = useState('');

  if (selectedId === '' && apiPets.length > 0) {
    const activeName = pets[activePetIndex]?.name ?? '';
    const match = apiPets.find(
      (c) => c.name.toLowerCase() === activeName.toLowerCase()
    );
    setSelectedId(String((match ?? apiPets[0]).id));
  }

  const petOptions = apiPets.map((c) => ({
    label: toCapitalize(c.name),
    value: String(c.id),
  }));

  const onSelect = (apiId: string) => {
    setSelectedId(apiId);
    const pet = apiPets.find((c) => String(c.id) === apiId);
    if (!pet) return;
    const idx = pets.findIndex(
      (p) => p.name.toLowerCase() === pet.name.toLowerCase()
    );
    if (idx !== -1) setActivePetIndex(idx);
  };

  return { petOptions, selectedId, onSelect };
}
