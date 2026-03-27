import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import { toggleCatSchedule } from '@/services/pets';

export type Meal = { id: string; time: string; amount: string };

export type Pet = {
  id: string;
  name: string;
  breed: string;
  weight: string;
  photo: string;
  scheduleEnabled: boolean;
  meals: Meal[];
};

const DEFAULT_MEALS: Meal[] = [
  { id: '1', time: '10:00', amount: '80 g' },
  { id: '2', time: '17:00', amount: '80 g' },
];

const INITIAL_PETS: Pet[] = [
  {
    id: '1',
    name: 'Pookie',
    breed: 'Scottish',
    weight: '12 kg',
    photo: 'https://placecats.com/200/200',
    scheduleEnabled: true,
    meals: DEFAULT_MEALS,
  },
];

type PetsContextValue = {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (index: number, pet: Partial<Pet>) => void;
  activePetIndex: number;
  setActivePetIndex: (index: number) => void;
  updateSchedule: (petIndex: number, meals: Meal[]) => void;
  toggleSchedule: (petIndex: number, enabled: boolean) => Promise<void>;
};

const PETS_STORAGE_KEY = 'pets_context';

const PetsContext = createContext<PetsContextValue | null>(null);

export function PetsProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [activePetIndex, setActivePetIndex] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(PETS_STORAGE_KEY).then((raw) => {
      if (raw) {
        setPets(JSON.parse(raw) as Pet[]);
      }
    });
  }, []);

  // Persist pets to local storage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets));
  }, [pets]);

  const addPet = (pet: Pet) => setPets((prev) => [...prev, pet]);

  const updatePet = (index: number, data: Partial<Pet>) =>
    setPets((prev) => prev.map((p, i) => (i === index ? { ...p, ...data } : p)));

  const updateSchedule = (petIndex: number, meals: Meal[]) =>
    setPets((prev) => prev.map((p, i) => (i === petIndex ? { ...p, meals } : p)));

  const toggleSchedule = async (petIndex: number, enabled: boolean): Promise<void> => {
    setPets((prev) => prev.map((p, i) => (i === petIndex ? { ...p, scheduleEnabled: enabled } : p)));
    const pet = pets[petIndex];
    if (pet) {
      await toggleCatSchedule(Number(pet.id), enabled);
    }
  };

  return (
    <PetsContext.Provider value={{ pets, addPet, updatePet, activePetIndex, setActivePetIndex, updateSchedule, toggleSchedule }}>
      {children}
    </PetsContext.Provider>
  );
}

export function usePets() {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error('usePets must be used inside PetsProvider');
  return ctx;
}
