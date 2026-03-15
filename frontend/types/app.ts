export type RootStackParamList = {
  Loading: undefined;
  Register: undefined;
  Login: undefined;
  AddPet: undefined;
  AddPetPhoto: { petId: number };
  SetFeeding: undefined;
  Home: undefined;
  Schedule: undefined;
  History: undefined;
  Settings: undefined;
  CatRecognition: { petNames: string[]; currentIndex: number };
  TrainModel: undefined;
};