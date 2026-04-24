import { renderHook, act } from '@testing-library/react-native';

import { useEditPet } from '@/hooks/pets/useEditPet';

import type { Pet } from '@/types';

const mockShowToast = jest.fn();
const mockUpdateMutate = jest.fn();
const mockUploadMutate = jest.fn();
const mockEnqueue = jest.fn();
const mockInvalidateQueries = jest.fn();

let mockIsOnline = true;

jest.mock('@/hooks', () => ({
  useNetworkStatus: () => ({ isOnline: true }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

jest.mock('@/contexts', () => ({
  useToast: () => ({ showToast: mockShowToast }),
  useOfflineQueue: () => ({ enqueue: mockEnqueue }),
  useSharedNetworkStatus: () => ({ isOnline: mockIsOnline }),
}));

jest.mock('@/services', () => ({
  useUpdateCat: () => ({ mutate: mockUpdateMutate }),
  useUploadPetImage: () => ({ mutate: mockUploadMutate }),
}));

jest.mock('@/utils', () => ({
  toUpdatePayload: (data: any) => ({
    name: data.name,
    weight: data.weight ? parseFloat(data.weight) : undefined,
    breed: data.breed || undefined,
    photo: data.photo ?? null,
  }),
  toCapitalize: (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
}));

const pet: Pet = { id: 3, name: 'Luna' };
const formData = { name: 'luna', breed: 'Siamese', weight: '4.5', photo: null };

describe('useEditPet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsOnline = true;
  });

  it('does nothing when currentPet is undefined', () => {
    const { result } = renderHook(() => useEditPet(undefined));

    act(() => { result.current.handleEditPet(formData); });

    expect(mockUpdateMutate).not.toHaveBeenCalled();
  });

  it('enqueues the update and shows an offline toast when offline', () => {
    mockIsOnline = false;
    const { result } = renderHook(() => useEditPet(pet));

    act(() => { result.current.handleEditPet(formData); });

    expect(mockEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'updatePet' }),
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      'No connection — changes will sync when back online',
      'error',
    );
    expect(mockUpdateMutate).not.toHaveBeenCalled();
  });

  it('calls updateCat with the pet id and payload when online', () => {
    const { result } = renderHook(() => useEditPet(pet));

    act(() => { result.current.handleEditPet(formData); });

    expect(mockUpdateMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 3, name: 'luna' }),
      expect.any(Object),
    );
  });

  it('shows a success toast and invalidates queries on success without a photo', () => {
    mockUpdateMutate.mockImplementation(
      (_payload: unknown, { onSuccess }: { onSuccess: () => void }) => { onSuccess(); },
    );
    const { result } = renderHook(() => useEditPet(pet));

    act(() => { result.current.handleEditPet({ ...formData, photo: null }); });

    expect(mockShowToast).toHaveBeenCalledWith('Luna updated!', 'success');
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['cats'] });
    expect(mockUploadMutate).not.toHaveBeenCalled();
  });

  it('uploads the photo and invalidates cache on settled when a photo is provided', () => {
    mockUpdateMutate.mockImplementation(
      (_payload: unknown, { onSuccess }: { onSuccess: () => void }) => { onSuccess(); },
    );
    mockUploadMutate.mockImplementation(
      (_payload: unknown, { onSettled }: { onSettled: () => void }) => { onSettled(); },
    );
    const { result } = renderHook(() => useEditPet(pet));

    act(() => { result.current.handleEditPet({ ...formData, photo: 'file://photo.jpg' }); });

    expect(mockUploadMutate).toHaveBeenCalledWith(
      { id: 3, uri: 'file://photo.jpg' },
      expect.any(Object),
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['cats'] });
  });

  it('enqueues and shows an offline toast when the update call has no response (network error)', () => {
    mockUpdateMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => { onError({}); },
    );
    const { result } = renderHook(() => useEditPet(pet));

    act(() => { result.current.handleEditPet(formData); });

    expect(mockEnqueue).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      'No connection — changes will sync when back online',
      'error',
    );
  });

  it('shows the server error message when the response contains one', () => {
    const error = { response: { data: { message: 'Pet not found' } } };
    mockUpdateMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => { onError(error); },
    );
    const { result } = renderHook(() => useEditPet(pet));

    act(() => { result.current.handleEditPet(formData); });

    expect(mockShowToast).toHaveBeenCalledWith('Pet not found', 'error');
  });

  it('falls back to the default error message when the server provides none', () => {
    const error = { response: { data: {} } };
    mockUpdateMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => { onError(error); },
    );
    const { result } = renderHook(() => useEditPet(pet));

    act(() => { result.current.handleEditPet(formData); });

    expect(mockShowToast).toHaveBeenCalledWith('Failed to update pet', 'error');
  });
});
