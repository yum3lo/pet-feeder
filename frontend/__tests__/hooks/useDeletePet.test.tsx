import { renderHook, act } from '@testing-library/react-native';

import { useDeletePet } from '@/hooks/pets/useDeletePet';

import type { Pet } from '@/types';

const mockShowToast = jest.fn();
const mockDeleteMutate = jest.fn();
const mockEnqueue = jest.fn();
const mockGetQueryData = jest.fn();
const mockSetQueryData = jest.fn();
const mockInvalidateQueries = jest.fn();

let mockIsOnline = true;

jest.mock('@/hooks', () => ({
  useNetworkStatus: () => ({ isOnline: true }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    getQueryData: mockGetQueryData,
    setQueryData: mockSetQueryData,
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock('@/contexts', () => ({
  useToast: () => ({ showToast: mockShowToast }),
  useOfflineQueue: () => ({ enqueue: mockEnqueue }),
  useSharedNetworkStatus: () => ({ isOnline: mockIsOnline }),
}));

jest.mock('@/services', () => ({
  useDeleteCat: () => ({ mutate: mockDeleteMutate }),
}));

const pet: Pet = { id: 5, name: 'Luna' };
const otherPet: Pet = { id: 6, name: 'Max' };

describe('useDeletePet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsOnline = true;
    mockGetQueryData.mockReturnValue([pet, otherPet]);
  });

  it('optimistically removes the pet from the cache before the API call', () => {
    const { result } = renderHook(() => useDeletePet());

    act(() => { result.current.handleDeletePet(pet); });

    expect(mockSetQueryData).toHaveBeenCalledWith(['cats'], [otherPet]);
  });

  it('enqueues deletion and shows an offline toast when offline', () => {
    mockIsOnline = false;
    const { result } = renderHook(() => useDeletePet());

    act(() => { result.current.handleDeletePet(pet); });

    expect(mockEnqueue).toHaveBeenCalledWith({ type: 'deletePet', payload: { id: 5 } });
    expect(mockShowToast).toHaveBeenCalledWith(
      'No connection — deletion will sync when back online',
      'error',
    );
    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });

  it('calls deleteCat with the pet id when online', () => {
    const { result } = renderHook(() => useDeletePet());

    act(() => { result.current.handleDeletePet(pet); });

    expect(mockDeleteMutate).toHaveBeenCalledWith(5, expect.any(Object));
  });

  it('invalidates queries and shows a success toast on delete success', () => {
    mockDeleteMutate.mockImplementation(
      (_id: unknown, { onSuccess }: { onSuccess: () => void }) => { onSuccess(); },
    );
    const { result } = renderHook(() => useDeletePet());

    act(() => { result.current.handleDeletePet(pet); });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['cats'] });
    expect(mockShowToast).toHaveBeenCalledWith('Pet deleted', 'success');
  });

  it('reverts the cache, calls onRevert, and shows an error toast on failure', () => {
    const error = { response: { data: { message: 'Server error' } } };
    const onRevert = jest.fn();
    mockDeleteMutate.mockImplementation(
      (_id: unknown, { onError }: { onError: (e: unknown) => void }) => { onError(error); },
    );
    const { result } = renderHook(() => useDeletePet());

    act(() => { result.current.handleDeletePet(pet, onRevert); });

    expect(mockSetQueryData).toHaveBeenLastCalledWith(['cats'], [pet, otherPet]);
    expect(onRevert).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('Server error', 'error');
  });

  it('falls back to the default error message when the server provides none', () => {
    mockDeleteMutate.mockImplementation(
      (_id: unknown, { onError }: { onError: (e: unknown) => void }) => {
        onError({ response: { data: {} } });
      },
    );
    const { result } = renderHook(() => useDeletePet());

    act(() => { result.current.handleDeletePet(pet); });

    expect(mockShowToast).toHaveBeenCalledWith('Failed to delete pet', 'error');
  });
});
