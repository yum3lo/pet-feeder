import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import { colors, typography, spacing, radius } from '@/style';

type Props = {
  image: string | null;
  onPress: () => void;
};

export default function ImageUploadArea({ image, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.imageUpload} onPress={onPress}>
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
});
