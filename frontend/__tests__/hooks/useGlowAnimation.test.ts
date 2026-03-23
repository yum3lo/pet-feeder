import { renderHook } from '@testing-library/react-native';

import { useGlowAnimation } from '@/hooks/animations/useGlowAnimation';

beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

describe('useGlowAnimation', () => {
  it('returns a truthy glowScale value', () => {
    const { result } = renderHook(() => useGlowAnimation());
    expect(result.current.glowScale).toBeTruthy();
  });

  it('returns a truthy glowOpacity value', () => {
    const { result } = renderHook(() => useGlowAnimation());
    expect(result.current.glowOpacity).toBeTruthy();
  });

  it('glowScale and glowOpacity are distinct interpolations', () => {
    const { result } = renderHook(() => useGlowAnimation());
    expect(result.current.glowScale).not.toBe(result.current.glowOpacity);
  });
});
