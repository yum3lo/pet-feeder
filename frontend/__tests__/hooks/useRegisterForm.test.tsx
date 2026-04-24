import { renderHook, act } from '@testing-library/react-native';

import { useRegisterForm } from '@/hooks/auth/useRegisterForm';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

// Variables prefixed with "mock" are hoisted by babel-plugin-jest-hoist
const mockShowToast = jest.fn();
const mockMutate = jest.fn();

jest.mock('@/contexts', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/services', () => ({
  useRegister: () => ({ mutate: mockMutate, isPending: false }),
}));

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NavigationProp<RootStackParamList>;

describe('useRegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty email, password and confirmPassword', () => {
    const { result } = renderHook(() => useRegisterForm(mockNavigation));

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.confirmPassword).toBe('');
    expect(result.current.isPending).toBe(false);
  });

  it('updates email via setEmail', () => {
    const { result } = renderHook(() => useRegisterForm(mockNavigation));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    expect(result.current.email).toBe('user@example.com');
  });

  it('shows an error toast when passwords do not match', () => {
    const { result } = renderHook(() => useRegisterForm(mockNavigation));

    act(() => {
      result.current.setPassword('password1');
      result.current.setConfirmPassword('password2');
    });

    act(() => {
      result.current.handleRegister();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Passwords do not match!', 'error');
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls register mutate when passwords match', () => {
    const { result } = renderHook(() => useRegisterForm(mockNavigation));

    act(() => {
      result.current.setEmail('user@example.com');
      result.current.setPassword('secret123');
      result.current.setConfirmPassword('secret123');
    });

    act(() => {
      result.current.handleRegister();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { email: 'user@example.com', password: 'secret123' },
      expect.any(Object),
    );
    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it('navigates to AddPet on successful registration', () => {
    mockMutate.mockImplementation((_payload: unknown, { onSuccess }: { onSuccess: () => void }) => {
      onSuccess();
    });

    const { result } = renderHook(() => useRegisterForm(mockNavigation));

    act(() => {
      result.current.setPassword('abc');
      result.current.setConfirmPassword('abc');
    });

    act(() => {
      result.current.handleRegister();
    });

    expect((mockNavigation as any).navigate).toHaveBeenCalledWith('AddPet');
  });

  it('shows error toast when registration fails', () => {
    const error = { response: { data: { message: 'Email already in use' } } };
    mockMutate.mockImplementation((_payload: unknown, { onError }: { onError: (e: unknown) => void }) => {
      onError(error);
    });

    const { result } = renderHook(() => useRegisterForm(mockNavigation));

    act(() => {
      result.current.setPassword('abc');
      result.current.setConfirmPassword('abc');
    });

    act(() => {
      result.current.handleRegister();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Email already in use', 'error');
  });
});
