import * as Network from 'expo-network';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const POLL_INTERVAL_MS = 2000;

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const mountedRef = useRef(true);

  const check = useRef(async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      if (!mountedRef.current) return;
      setIsOnline(state.isConnected === true);
    } catch {
      // silently ignore transient errors
    }
  }).current;

  useEffect(() => {
    mountedRef.current = true;
    check();

    const interval = setInterval(check, POLL_INTERVAL_MS);

    const appStateSub = AppState.addEventListener('change', (next) => {
      if (next === 'active') check();
    });

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      appStateSub.remove();
    };
  }, []);

  return { isOnline };
}



