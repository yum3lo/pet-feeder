import { useState } from 'react';

import { usePets } from '@/contexts';
import { useGetPets } from '@/services';
import { toCapitalize } from '@/utils';

export function usePetSelector() {
  const { pets, activePetIndex, setActivePetIndex } = usePets();
  const { data: apiCats = [] } = useGetPets();

  const [selectedId, setSelectedId] = useState('');

  if (selectedId === '' && apiCats.length > 0) {
    const activeName = pets[activePetIndex]?.name ?? '';
    const match = apiCats.find(
      (c) => c.name.toLowerCase() === activeName.toLowerCase()
    );
    setSelectedId(String((match ?? apiCats[0]).id));
  }

  const petOptions = apiCats.map((c) => ({
    label: toCapitalize(c.name),
    value: String(c.id),
  }));

  const onSelect = (apiId: string) => {
    setSelectedId(apiId);
    const cat = apiCats.find((c) => String(c.id) === apiId);
    if (!cat) return;
    const idx = pets.findIndex(
      (p) => p.name.toLowerCase() === cat.name.toLowerCase()
    );
    if (idx !== -1) setActivePetIndex(idx);
  };

  return { petOptions, selectedId, onSelect };
}
