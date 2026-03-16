import { renderHook, act } from '@testing-library/react-native';

import { useSettingsPets } from '@/hooks';

import type { Pet } from '@/types';

const mockShowToast = jest.fn();
const mockCreateCatMutate = jest.fn();
const mockUploadImageMutate = jest.fn();
const mockInvalidateQueries = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

jest.mock('@/contexts', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/services', () => ({
  useCreateCat: () => ({ mutate: mockCreateCatMutate }),
  useUploadPetImage: () => ({ mutate: mockUploadImageMutate }),
}));

const defaultPet: Pet = { id: 1, name: 'Pookie' };

describe('useSettingsPets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('initializes with all modals hidden and cardHeight 0', () => {
    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );
    expect(result.current.addModalVisible).toBe(false);
    expect(result.current.editModalVisible).toBe(false);
    expect(result.current.recognitionModalVisible).toBe(false);
    expect(result.current.cardHeight).toBe(0);
  });

  it('setAddModalVisible opens and closes the add modal', () => {
    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );

    act(() => { result.current.setAddModalVisible(true); });
    expect(result.current.addModalVisible).toBe(true);

    act(() => { result.current.setAddModalVisible(false); });
    expect(result.current.addModalVisible).toBe(false);
  });

  it('setEditModalVisible opens and closes the edit modal', () => {
    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );

    act(() => { result.current.setEditModalVisible(true); });
    expect(result.current.editModalVisible).toBe(true);

    act(() => { result.current.setEditModalVisible(false); });
    expect(result.current.editModalVisible).toBe(false);
  });

  it('handleEditPet hides the edit modal', () => {
    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );

    act(() => { result.current.setEditModalVisible(true); });
    act(() => {
      result.current.handleEditPet({ name: 'Updated', breed: '', weight: '', photo: null });
    });

    expect(result.current.editModalVisible).toBe(false);
  });

  it('handleAddPet hides the add modal and calls createCat', () => {
    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );

    act(() => { result.current.setAddModalVisible(true); });
    act(() => {
      result.current.handleAddPet({ name: 'Luna', breed: 'Siamese', weight: '4.5', photo: null });
    });

    expect(result.current.addModalVisible).toBe(false);
    expect(mockCreateCatMutate).toHaveBeenCalledWith(
      { name: 'Luna', weight: 4.5, breed: 'Siamese' },
      expect.any(Object),
    );
  });

  it('handleAddPet sends undefined for optional fields when blank', () => {
    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );

    act(() => {
      result.current.handleAddPet({ name: 'Luna', breed: '', weight: '', photo: null });
    });

    expect(mockCreateCatMutate).toHaveBeenCalledWith(
      { name: 'Luna', weight: undefined, breed: undefined },
      expect.any(Object),
    );
  });

  it('handleAddPet on success without photo invalidates queries and updates index', () => {
    const setCurrentIndex = jest.fn();
    mockCreateCatMutate.mockImplementation(
      (_payload: unknown, { onSuccess }: { onSuccess: (cat: { id: number }) => void }) => {
        onSuccess({ id: 99 });
      },
    );

    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex }),
    );

    act(() => {
      result.current.handleAddPet({ name: 'Luna', breed: '', weight: '', photo: null });
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['cats'] });

    act(() => { jest.runAllTimers(); });
    expect(setCurrentIndex).toHaveBeenCalledWith(1);
  });

  it('handleAddPet on success with photo calls uploadImage', () => {
    mockCreateCatMutate.mockImplementation(
      (_payload: unknown, { onSuccess }: { onSuccess: (cat: { id: number }) => void }) => {
        onSuccess({ id: 99 });
      },
    );

    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );

    act(() => {
      result.current.handleAddPet({
        name: 'Luna',
        breed: '',
        weight: '',
        photo: 'file://photo.jpg',
      });
    });

    expect(mockUploadImageMutate).toHaveBeenCalledWith(
      { id: 99, uri: 'file://photo.jpg' },
      expect.any(Object),
    );
  });

  it('handleAddPet shows an error toast on createCat failure', () => {
    const error = { response: { data: { message: 'Server error' } } };
    mockCreateCatMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => {
        onError(error);
      },
    );

    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );

    act(() => {
      result.current.handleAddPet({ name: 'Luna', breed: '', weight: '', photo: null });
    });

    expect(mockShowToast).toHaveBeenCalledWith('Server error', 'error');
  });

  it('setCardHeight updates cardHeight', () => {
    const { result } = renderHook(() =>
      useSettingsPets({ pets: [defaultPet], currentIndex: 0, setCurrentIndex: jest.fn() }),
    );

    act(() => { result.current.setCardHeight(200); });
    expect(result.current.cardHeight).toBe(200);
  });
});
