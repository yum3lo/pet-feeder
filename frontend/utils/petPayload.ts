import type { PetData } from '@/components';
import type { CreatePetPayload } from '@/types';

export function toCreatePayload(data: PetData): CreatePetPayload & { photo?: string } {
  return {
    name: data.name,
    weight: data.weight ? parseFloat(data.weight) : undefined,
    breed: data.breed || undefined,
    photo: data.photo || undefined,
  };
}

export function toUpdatePayload(
  data: PetData,
  currentImageUrl?: string,
): Partial<CreatePetPayload> & { photo?: string } {
  return {
    name: data.name || undefined,
    weight: data.weight ? parseFloat(data.weight) : undefined,
    breed: data.breed || undefined,
    photo: data.photo && data.photo !== currentImageUrl ? data.photo : undefined,
  };
}
