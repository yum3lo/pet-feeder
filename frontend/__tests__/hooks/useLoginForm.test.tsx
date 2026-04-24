import { renderHook, act } from '@testing-library/react-native';

import { useLoginForm } from '@/hooks/auth/useLoginForm';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

const mockShowToast = jest.fn();
const mockMutate = jest.fn();
const mockApiGet = jest.fn();

jest.mock('@/contexts', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/services', () => ({
  useLogin: () => ({ mutate: mockMutate, isPending: false }),
  api: { get: mockApiGet },
}));

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NavigationProp<RootStackParamList>;

describe('useLoginForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('initializes with empty email and password', () => {
    const { result } = renderHook(() => useLoginForm(mockNavigation));
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isPending).toBe(false);
  });

  it('updates email via setEmail', () => {
    const { result } = renderHook(() => useLoginForm(mockNavigation));
    act(() => {
      result.current.setEmail('user@example.com');
    });
    expect(result.current.email).toBe('user@example.com');
  });

  it('updates password via setPassword', () => {
    const { result } = renderHook(() => useLoginForm(mockNavigation));
    act(() => {
      result.current.setPassword('secret123');
    });
    expect(result.current.password).toBe('secret123');
  });

  it('calls login mutate with the current email and password', () => {
    const { result } = renderHook(() => useLoginForm(mockNavigation));

    act(() => {
      result.current.setEmail('user@example.com');
      result.current.setPassword('secret123');
    });
    act(() => {
      result.current.handleLogin();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { email: 'user@example.com', password: 'secret123' },
      expect.any(Object),
    );
  });

  it('navigates to AddPet when the user has no cats', async () => {
    mockApiGet.mockResolvedValueOnce({ data: [] });

    let done!: () => void;
    const settled = new Promise<void>(resolve => { done = resolve; });
    mockMutate.mockImplementation(async (_payload: unknown, { onSuccess }: { onSuccess: () => Promise<void> }) => {
      await onSuccess();
      done();
    });

    const { result } = renderHook(() => useLoginForm(mockNavigation));
    act(() => { result.current.handleLogin(); });
    await act(async () => { await settled; });

    expect((mockNavigation as any).navigate).toHaveBeenCalledWith('AddPet');
  });

  it('navigates to AddPet when the cats fetch throws', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('Network error'));

    let done!: () => void;
    const settled = new Promise<void>(resolve => { done = resolve; });
    mockMutate.mockImplementation(async (_payload: unknown, { onSuccess }: { onSuccess: () => Promise<void> }) => {
      await onSuccess();
      done();
    });

    const { result } = renderHook(() => useLoginForm(mockNavigation));
    act(() => { result.current.handleLogin(); });
    await act(async () => { await settled; });

    expect((mockNavigation as any).navigate).toHaveBeenCalledWith('AddPet');
  });

  it('shows an error toast when login fails', () => {
    const error = { response: { data: { message: 'Invalid credentials' } } };
    mockMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => {
        onError(error);
      },
    );

    const { result } = renderHook(() => useLoginForm(mockNavigation));
    act(() => {
      result.current.handleLogin();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Invalid credentials', 'error');
  });

  it('falls back to the default error message when the server response has no message', () => {
    mockMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => {
        onError({});
      },
    );

    const { result } = renderHook(() => useLoginForm(mockNavigation));
    act(() => {
      result.current.handleLogin();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Login failed', 'error');
  });

  it('locks the form and shows a lockout toast after 5 failed login attempts', () => {
    jest.useFakeTimers();
    const error = { response: { data: { message: 'Wrong password' } } };
    mockMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => { onError(error); },
    );

    const { result } = renderHook(() => useLoginForm(mockNavigation));
    for (let i = 0; i < 5; i++) {
      act(() => { result.current.handleLogin(); });
    }

    expect(mockShowToast).toHaveBeenLastCalledWith(
      'Too many failed attempts. Please wait 30 seconds.',
      'error',
    );
    expect(result.current.isPending).toBe(true);

    act(() => { jest.runAllTimers(); });
    expect(result.current.isPending).toBe(false);
    jest.useRealTimers();
  });

  it('blocks login and shows a try-again message when the form is already locked', () => {
    jest.useFakeTimers();
    const error = { response: { data: { message: 'Wrong password' } } };
    mockMutate.mockImplementation(
      (_payload: unknown, { onError }: { onError: (e: unknown) => void }) => { onError(error); },
    );

    const { result } = renderHook(() => useLoginForm(mockNavigation));
    for (let i = 0; i < 5; i++) {
      act(() => { result.current.handleLogin(); });
    }

    mockShowToast.mockClear();
    mockMutate.mockClear();

    act(() => { result.current.handleLogin(); });

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('Too many attempts'),
      'error',
    );

    act(() => { jest.runAllTimers(); });
    jest.useRealTimers();
  });
});
