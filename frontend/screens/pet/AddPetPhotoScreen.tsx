import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, common, radius } from '@/style';
import ActionButtons from '@/components/actions/ActionButtons';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPetPhoto'>;

export default function AddPetPhotoScreen({ navigation }: Props) {
  const [image, setImage] = useState<string | null>(null);

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

  return (
    <>
      <View style={common.screenContainer}>
        <Text style={[typography.h2, common.title]}>
          Add a photo
        </Text>
        <Text style={[typography.bodySmall, common.subtitle]}>
         Choose a photo of your pet for your pet’s profile
        </Text>

        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <MaterialIcons name="add-a-photo" size={40} color={colors.stroke} />
              <Text style={[typography.bodySmall, { color: colors.stroke, marginTop: spacing.sm }]}>
                Tap to upload
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <ActionButtons
          variant="row"
          leftLabel="Skip"
          rightLabel="Add"
          onLeft={() => navigation.navigate('SetFeeding')}
          onRight={() => navigation.navigate('SetFeeding')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  imageUpload: {
    width: '90%',
    aspectRatio: 1.3,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outline,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  buttonHalf: {
    width: 110,
  },
});
