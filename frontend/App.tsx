import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { PetsProvider } from './contexts/PetsContext';

export default function App() {
  return (
    <PetsProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </PetsProvider>
  );
}
