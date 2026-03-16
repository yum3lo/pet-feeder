import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import { useToast } from '@/contexts';
import { useUploadPetImage } from '@/services';

import type { RootStackParamList } from '@/types';
import type { NavigationProp } from '@react-navigation/native';

export function useAddPetPhoto(petId: number, navigation: NavigationProp<RootStackParamList>) {
  const [image, setImage] = useState<string | null>(null);
  const { mutate: uploadImage, isPending } = useUploadPetImage();
  const { showToast } = useToast();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdd = () => {
    if (!image) {
      navigation.navigate('SetFeeding');
      return;
    }
    uploadImage(
      { id: petId, uri: image },
      {
        onSuccess: () => navigation.navigate('SetFeeding'),
        onError: (err: any) =>
          showToast(err?.response?.data?.message ?? 'Failed to upload photo', 'error'),
      },
    );
  };

  return { image, isPending, pickImage, handleAdd };
}
