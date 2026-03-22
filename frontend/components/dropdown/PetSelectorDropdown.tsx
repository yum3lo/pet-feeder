import { Dropdown } from '@/components';
import { usePetSelector } from '@/hooks';

type Props = {
  style?: object;
};

export default function PetSelectorDropdown({ style }: Props) {
  const { petOptions, selectedId, onSelect } = usePetSelector();

  if (petOptions.length === 0) return null;

  return (
    <Dropdown
      options={petOptions}
      value={selectedId}
      onSelect={onSelect}
      style={style}
      compact
    />
  );
}
