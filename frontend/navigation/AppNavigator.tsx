import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useNotificationStream } from '@/hooks';
import { LoadingScreen, RegisterScreen, LoginScreen, AddDeviceScreen, AddPetScreen, AddPetPhotoScreen, SetFeedingScreen, HomeScreen, ScheduleScreen, HistoryScreen, SettingsScreen, CatRecognitionScreen, BackgroundCaptureScreen, TrainModelScreen } from '@/screens';

import type { RootStackParamList } from '@/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  useNotificationStream();

  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
      <Stack.Screen name="AddPet" component={AddPetScreen} />
      <Stack.Screen name="AddPetPhoto" component={AddPetPhotoScreen} />
      <Stack.Screen name="SetFeeding" component={SetFeedingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CatRecognition" component={CatRecognitionScreen} />
      <Stack.Screen name="BackgroundCapture" component={BackgroundCaptureScreen} />
      <Stack.Screen name="TrainModel" component={TrainModelScreen} />
    </Stack.Navigator>
  );
}
