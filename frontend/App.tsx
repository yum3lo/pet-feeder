import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OfflineBanner, Toast } from '@/components';
import { PetsProvider, OfflineQueueProvider, ToastProvider, NetworkStatusProvider } from '@/contexts';
import { AppNavigator, navigationRef } from '@/navigation';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>
      <NetworkStatusProvider>
      <ToastProvider>
        <PetsProvider>
          <OfflineQueueProvider>
            <NavigationContainer ref={navigationRef}>
              <AppNavigator />
              <Toast />
              <OfflineBanner />
              <StatusBar style="light" />
            </NavigationContainer>
          </OfflineQueueProvider>
        </PetsProvider>
      </ToastProvider>
      </NetworkStatusProvider>
    </SafeAreaProvider>
    </QueryClientProvider>
  );
}
