import { renderHook, act } from '@testing-library/react-native';
import React from 'react';

import { ToastProvider, useToast } from '@/contexts/ToastContext';

jest.mock('@/hooks', () => ({
  useNetworkStatus: () => ({ isOnline: true }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('ToastContext', () => {
  it('throws when used outside of ToastProvider', () => {
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used inside ToastProvider',
    );
  });

  it('initial toast state is not visible', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    expect(result.current.toast.visible).toBe(false);
  });

  it('showToast makes the toast visible with the correct message and type', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('Something went wrong', 'error');
    });

    expect(result.current.toast.visible).toBe(true);
    expect(result.current.toast.message).toBe('Something went wrong');
    expect(result.current.toast.type).toBe('error');
  });

  it('showToast defaults to success type when no type is given', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('Saved!');
    });

    expect(result.current.toast.type).toBe('success');
    expect(result.current.toast.visible).toBe(true);
  });

  it('calling showToast a second time replaces the previous toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('First message', 'success');
    });
    act(() => {
      result.current.showToast('Second message', 'error');
    });

    expect(result.current.toast.message).toBe('Second message');
    expect(result.current.toast.type).toBe('error');
  });
});
