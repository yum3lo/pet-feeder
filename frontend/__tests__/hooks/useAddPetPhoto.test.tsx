import { renderHook, act } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';

import { useAddPetPhoto } from '@/hooks/pets/useAddPetPhoto';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

const mockShowToast = jest.fn();
const mockMutate = jest.fn();

jest.mock('@/hooks', () => ({
  useNetworkStatus: () => ({ isOnline: true }),
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockResolvedValue({ uri: 'file://compressed.jpg' }),
  SaveFormat: { JPEG: 'jpeg' },
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@/contexts', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/services', () => ({
  useUploadPetImage: () => ({ mutate: mockMutate, isPending: false }),
}));

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NavigationProp<RootStackParamList>;

describe('useAddPetPhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with null image and not pending', () => {
    const { result } = renderHook(() => useAddPetPhoto(1, mockNavigation));
    expect(result.current.image).toBeNull();
    expect(result.current.isPending).toBe(false);
  });

  it('pickImage sets the selected image URI when not canceled', async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://photo.jpg' } as any],
    });

    const { result } = renderHook(() => useAddPetPhoto(1, mockNavigation));
    await act(async () => {
      await result.current.pickImage();
    });

    expect(result.current.image).toBe('file://compressed.jpg');
  });

  it('handleAdd navigates to SetFeeding without uploading when there is no image', () => {
    const { result } = renderHook(() => useAddPetPhoto(5, mockNavigation));

    act(() => {
      result.current.handleAdd();
    });

    expect((mockNavigation as any).navigate).toHaveBeenCalledWith('SetFeeding');
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('handleAdd uploads the image and navigates to SetFeeding on success', async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://photo.jpg' } as any],
    });
    mockMutate.mockImplementation(
      (_payload: unknown, { onSuccess }: { onSuccess: () => void }) => {
        onSuccess();
      },
    );

    const { result } = renderHook(() => useAddPetPhoto(5, mockNavigation));
    await act(async () => {
      await result.current.pickImage();
    });
    act(() => {
      result.current.handleAdd();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { id: 5, uri: 'file://compressed.jpg' },
      expect.any(Object),
    );
    expect((mockNavigation as any).navigate).toHaveBeenCalledWith('SetFeeding');
  });

  it('handleAdd shows an error toast when the upload fails', async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://photo.jpg' } as any],
    });
    const error = { response: { data: { message: 'Upload failed' } } };
    mockMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => {
        onError(error);
      },
    );

    const { result } = renderHook(() => useAddPetPhoto(5, mockNavigation));
    await act(async () => {
      await result.current.pickImage();
    });
    act(() => {
      result.current.handleAdd();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Upload failed', 'error');
  });

  it('handleAdd falls back to the default error message when none is provided', async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://photo.jpg' } as any],
    });
    mockMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => {
        onError({});
      },
    );

    const { result } = renderHook(() => useAddPetPhoto(5, mockNavigation));
    await act(async () => {
      await result.current.pickImage();
    });
    act(() => {
      result.current.handleAdd();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Failed to upload photo', 'error');
  });
});
