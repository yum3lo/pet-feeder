import { renderHook, act } from '@testing-library/react-native';
import React from 'react';

import { PetsProvider, usePets } from '@/contexts';

import type { Pet } from '@/contexts/PetsContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PetsProvider>{children}</PetsProvider>
);

const makePet = (overrides: Partial<Pet> = {}): Pet => ({
  id: '2',
  name: 'Luna',
  breed: 'Siamese',
  weight: '4 kg',
  photo: '',
  scheduleEnabled: false,
  meals: [],
  ...overrides,
});

describe('PetsContext', () => {
  it('throws when used outside of PetsProvider', () => {
    expect(() => renderHook(() => usePets())).toThrow(
      'usePets must be used inside PetsProvider',
    );
  });

  it('initializes with a default pet', () => {
    const { result } = renderHook(() => usePets(), { wrapper });
    expect(result.current.pets).toHaveLength(1);
    expect(result.current.pets[0].name).toBe('Pookie');
  });

  it('activePetIndex starts at 0', () => {
    const { result } = renderHook(() => usePets(), { wrapper });
    expect(result.current.activePetIndex).toBe(0);
  });

  it('addPet appends a new pet to the list', () => {
    const { result } = renderHook(() => usePets(), { wrapper });

    act(() => {
      result.current.addPet(makePet({ name: 'Luna' }));
    });

    expect(result.current.pets).toHaveLength(2);
    expect(result.current.pets[1].name).toBe('Luna');
  });

  it('updatePet updates only the specified pet', () => {
    const { result } = renderHook(() => usePets(), { wrapper });

    act(() => {
      result.current.updatePet(0, { name: 'Updated Name', weight: '5 kg' });
    });

    expect(result.current.pets[0].name).toBe('Updated Name');
    expect(result.current.pets[0].weight).toBe('5 kg');
  });

  it('updatePet does not affect other pets', () => {
    const { result } = renderHook(() => usePets(), { wrapper });

    act(() => {
      result.current.addPet(makePet({ name: 'Luna' }));
      result.current.updatePet(0, { name: 'Changed' });
    });

    expect(result.current.pets[1].name).toBe('Luna');
  });

  it('toggleSchedule changes the scheduleEnabled flag', () => {
    const { result } = renderHook(() => usePets(), { wrapper });
    const original = result.current.pets[0].scheduleEnabled;

    act(() => {
      result.current.toggleSchedule(0, !original);
    });

    expect(result.current.pets[0].scheduleEnabled).toBe(!original);
  });

  it('updateSchedule replaces meals for the given pet', () => {
    const { result } = renderHook(() => usePets(), { wrapper });
    const newMeals = [{ id: '99', time: '08:00', amount: '60 g' }];

    act(() => {
      result.current.updateSchedule(0, newMeals);
    });

    expect(result.current.pets[0].meals).toEqual(newMeals);
  });

  it('setActivePetIndex updates the active index', () => {
    const { result } = renderHook(() => usePets(), { wrapper });

    act(() => {
      result.current.addPet(makePet());
      result.current.setActivePetIndex(1);
    });

    expect(result.current.activePetIndex).toBe(1);
  });

  it('updateSchedule does not affect other pets (false branch)', () => {
    const { result } = renderHook(() => usePets(), { wrapper });

    act(() => {
      result.current.addPet(makePet({ meals: [{ id: '1', time: '09:00', amount: '50 g' }] }));
      result.current.updateSchedule(0, []);
    });

    expect(result.current.pets[1].meals).toEqual([{ id: '1', time: '09:00', amount: '50 g' }]);
  });

  it('toggleSchedule does not affect other pets (false branch)', () => {
    const { result } = renderHook(() => usePets(), { wrapper });

    act(() => {
      result.current.addPet(makePet({ scheduleEnabled: true }));
      result.current.toggleSchedule(0, false);
    });

    expect(result.current.pets[1].scheduleEnabled).toBe(true);
  });
});
