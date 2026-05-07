import { usePets } from '@/contexts';
import { useGetPets } from '@/services';

export function usePetSelector() {
  const { activePetIndex, setActivePetIndex } = usePets();
  const { data: apiPets = [] } = useGetPets();

  const activePet = apiPets[activePetIndex] ?? apiPets[0];
  const selectedId = activePet ? String(activePet.id) : '';

  const petOptions = apiPets.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  const onSelect = (apiId: string) => {
    const idx = apiPets.findIndex((c) => String(c.id) === apiId);
    if (idx !== -1) setActivePetIndex(idx);
  };

  return { petOptions, selectedId, onSelect };
}
