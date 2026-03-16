import { Text, View } from 'react-native';

import { ActionButtons, ImageUploadArea } from '@/components';
import { useAddPetPhoto } from '@/hooks';
import { typography, common } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPetPhoto'>;

export default function AddPetPhotoScreen({ navigation, route }: Props) {
  const { petId } = route.params;
  const { image, isPending, pickImage, handleAdd } = useAddPetPhoto(petId, navigation);

  return (
    <View style={common.screenContainer}>
      <Text style={[typography.h2, common.title]}>Add a photo</Text>
      <Text style={[typography.bodySmall, common.subtitle]}>
        Choose a photo of your pet for your pet's profile
      </Text>

      <ImageUploadArea image={image} onPress={pickImage} />

      <ActionButtons
        variant="row"
        leftLabel="Skip"
        rightLabel={isPending ? 'Uploading…' : 'Add'}
        onLeft={() => navigation.navigate('SetFeeding')}
        onRight={handleAdd}
      />
    </View>
  );
}
