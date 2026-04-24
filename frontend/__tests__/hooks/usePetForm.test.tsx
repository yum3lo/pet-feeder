import { renderHook, act } from '@testing-library/react-native';

import { usePetForm } from '@/hooks/pets/usePetForm';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

const mockShowToast = jest.fn();
const mockMutate = jest.fn();

jest.mock('@/hooks', () => ({
  useNetworkStatus: () => ({ isOnline: true }),
}));

jest.mock('@/contexts', () => ({
  useToast: () => ({ showToast: mockShowToast }),
  useOfflineQueue: () => ({ enqueue: jest.fn() }),
  useSharedNetworkStatus: () => ({ isOnline: true }),
}));

jest.mock('@/services', () => ({
  useCreateCat: () => ({ mutate: mockMutate, isPending: false }),
}));

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NavigationProp<RootStackParamList>;

describe('usePetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty pet fields and not pending', () => {
    const { result } = renderHook(() => usePetForm(mockNavigation));
    expect(result.current.pet).toEqual({ petName: '', petWeight: '', petBreed: '' });
    expect(result.current.isPending).toBe(false);
  });

  it('updates pet via setPet', () => {
    const { result } = renderHook(() => usePetForm(mockNavigation));
    act(() => {
      result.current.setPet({ petName: 'Luna', petWeight: '4.5', petBreed: 'Siamese' });
    });
    expect(result.current.pet).toEqual({ petName: 'Luna', petWeight: '4.5', petBreed: 'Siamese' });
  });

  it('calls createCat with the parsed numeric weight', () => {
    const { result } = renderHook(() => usePetForm(mockNavigation));
    act(() => {
      result.current.setPet({ petName: 'Luna', petWeight: '4.5', petBreed: 'Siamese' });
    });
    act(() => {
      result.current.handleSubmit();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { name: 'Luna', weight: 4.5, breed: 'Siamese' },
      expect.any(Object),
    );
  });

  it('navigates to AddPetPhoto with the created pet id on success', () => {
    mockMutate.mockImplementation(
      (_payload: unknown, { onSuccess }: { onSuccess: (cat: { id: number }) => void }) => {
        onSuccess({ id: 42 });
      },
    );

    const { result } = renderHook(() => usePetForm(mockNavigation));
    act(() => {
      result.current.handleSubmit();
    });

    expect((mockNavigation as any).navigate).toHaveBeenCalledWith('AddPetPhoto', { petId: 42 });
  });

  it('shows an error toast when pet creation fails', () => {
    const error = { response: { data: { message: 'Name is required' } } };
    mockMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => {
        onError(error);
      },
    );

    const { result } = renderHook(() => usePetForm(mockNavigation));
    act(() => {
      result.current.handleSubmit();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Name is required', 'error');
  });

  it('falls back to the default error message when the server sends no message', () => {
    mockMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => {
        onError({ response: { data: {} } });
      },
    );

    const { result } = renderHook(() => usePetForm(mockNavigation));
    act(() => {
      result.current.handleSubmit();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Failed to add pet', 'error');
  });
});
