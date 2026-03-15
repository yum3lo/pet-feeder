export interface CreatePetPayload {
  name: string;
  weight?: number;
  breed?: string;
}

export interface Pet {
  id: number;
  name: string;
  weight?: number;
  breed?: string;
  imageUrl?: string;
}