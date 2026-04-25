export interface CreatePetPayload {
  name: string;
  weight?: number;
  breed?: string;
  species?: string;
  dietaryRestrictions?: string[];
}

export interface Pet {
  id: number;
  name: string;
  weight?: number;
  breed?: string;
  species?: string;
  imageUrl?: string;
  dietaryRestrictions?: string[];
}