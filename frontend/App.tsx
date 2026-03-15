import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PetsProvider } from './contexts/PetsContext';
import { ToastProvider } from './contexts/ToastContext';
import Toast from './components/toast/Toast';

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <PetsProvider>
          <NavigationContainer>
            <AppNavigator />
            <Toast />
            <StatusBar style="light" />
          </NavigationContainer>
        </PetsProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
