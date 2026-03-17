import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Toast from './components/toast/Toast';
import { PetsProvider } from './contexts/PetsContext';
import { ToastProvider } from './contexts/ToastContext';
import AppNavigator from './navigation/AppNavigator';
import { navigationRef } from './navigation/navigationRef';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>
      <ToastProvider>
        <PetsProvider>
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
            <Toast />
            <StatusBar style="light" />
          </NavigationContainer>
        </PetsProvider>
      </ToastProvider>
    </SafeAreaProvider>
    </QueryClientProvider>
  );
}
