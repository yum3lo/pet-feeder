import { createContext, useContext, type ReactNode } from 'react';

import { useNetworkStatus } from '@/hooks';

type NetworkStatusContextValue = {
  isOnline: boolean;
};

const NetworkStatusContext = createContext<NetworkStatusContextValue>({ isOnline: true });

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const { isOnline } = useNetworkStatus();
  console.log('[NetworkStatus] isOnline ->', isOnline);
  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useSharedNetworkStatus() {
  return useContext(NetworkStatusContext);
}
