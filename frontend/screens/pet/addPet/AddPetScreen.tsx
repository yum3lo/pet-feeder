import { Text, View, TextInput, TouchableOpacity } from 'react-native';

import { BackButton, Dropdown } from '@/components';
import breedOptions from '@/data/breeds.json';
import { usePetForm } from '@/hooks';
import { colors, typography, common } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPet'>;

export default function AddPetScreen({ navigation }: Props) {
  const { pet, setPet, isPending, handleSubmit } = usePetForm(navigation);

  const petFields = [
    { key: 'petName', placeholder: 'Pet Name' },
  ] as const;

  return (
    <>
      <View style={common.screenContainer}>
        <Text style={[typography.h2, common.title]}>Add your pet</Text>
        <Text style={[typography.bodySmall, common.subtitle]}>
          If you have multiple pets, choose one to start with
        </Text>
        {petFields.map((field) => (
          <TextInput
            key={field.key}
            style={common.input}
            placeholder={field.placeholder}
            placeholderTextColor={colors.stroke}
            value={pet[field.key]}
            onChangeText={(text) => setPet({ ...pet, [field.key]: text })}
            autoCapitalize='none'
          />
        ))}
        <View style={[common.input, styles.inputWithSuffix]}>
          <TextInput
            style={styles.innerInput}
            placeholder='Pet Weight'
            placeholderTextColor={colors.stroke}
            value={pet.petWeight}
            onChangeText={(text) => setPet({ ...pet, petWeight: text })}
            keyboardType='numeric'
          />
          <Text style={styles.suffix}>kg</Text>
        </View>
        <Dropdown
          placeholder='Breed'
          options={breedOptions}
          value={pet.petBreed}
          onSelect={(value) => setPet({ ...pet, petBreed: value })}
        />

        <TouchableOpacity
          style={[common.button, { backgroundColor: colors.accent }]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text style={[typography.bodyBold, { color: colors.background }]}>
            {isPending ? 'Adding…' : 'Add Pet'}
          </Text>
        </TouchableOpacity>
      </View>
      <BackButton onPress={() => navigation.navigate('Login')} />
    </>
  );
}
