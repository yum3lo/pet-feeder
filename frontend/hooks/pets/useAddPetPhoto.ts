import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';

import { useToast } from '@/contexts';
import { useUploadPetImage } from '@/services';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.75;
const PENDING_UPLOAD_KEY = 'pending_pet_photo';

async function compressImage(uri: string): Promise<string> {
  const compressed = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_DIMENSION } }],
    { compress: JPEG_QUALITY, format: ImageManipulator.SaveFormat.JPEG },
  );
  return compressed.uri;
}

export function useAddPetPhoto(petId: number, navigation: NavigationProp<RootStackParamList>) {
  const [image, setImage] = useState<string | null>(null);
  const { mutate: uploadImage, isPending } = useUploadPetImage();
  const { showToast } = useToast();

  // Restore any pending upload for this pet that survived a crash / power loss
  useEffect(() => {
    AsyncStorage.getItem(PENDING_UPLOAD_KEY).then((raw) => {
      if (!raw) return;
      const saved = JSON.parse(raw) as { petId: number; uri: string };
      if (saved.petId === petId) {
        setImage(saved.uri);
      }
    });
  }, [petId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);
      await AsyncStorage.setItem(PENDING_UPLOAD_KEY, JSON.stringify({ petId, uri: compressedUri }));
      setImage(compressedUri);
    }
  };

  const handleAdd = () => {
    if (!image) {
      AsyncStorage.removeItem(PENDING_UPLOAD_KEY);
      navigation.navigate('SetFeeding');
      return;
    }
    uploadImage(
      { id: petId, uri: image },
      {
        onSuccess: () => {
          AsyncStorage.removeItem(PENDING_UPLOAD_KEY);
          navigation.navigate('SetFeeding');
        },
        onError: (err: any) =>
          showToast(err?.response?.data?.message ?? 'Failed to upload photo', 'error'),
      },
    );
  };

  return { image, isPending, pickImage, handleAdd };
}
