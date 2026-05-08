export type RootStackParamList = {
  Loading: undefined;
  Register: undefined;
  Login: undefined;
  AddDevice: undefined;
  AddPet: undefined;
  AddPetPhoto: { petId: number };
  SetFeeding: undefined;
  Home: undefined;
  Schedule: undefined;
  History: undefined;
  Settings: undefined;
  CatRecognition: { petNames: string[]; petIds: number[]; deviceId: string; currentIndex: number };
  BackgroundCapture: { petNames: string[]; petIds: number[] };
  TrainModel: { deviceId?: string } | undefined;
};