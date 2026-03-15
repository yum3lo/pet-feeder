import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { Dropdown } from '@/components';
import { useToast } from '@/contexts';
import breedOptions from '@/data/breeds.json';
import { useCreateCat } from '@/services';
import { colors, typography, spacing, common } from '@/style';

import type { RootStackParamList } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';


type Props = NativeStackScreenProps<RootStackParamList, 'AddPet'>;

export default function AddPetScreen({ navigation }: Props) {
  const [pet, setPet] = useState({petName: '', petWeight: '', petAge: '', petBreed:''});
  const { mutate: createPet, isPending } = useCreateCat();
  const { showToast } = useToast();

  const petFields = [
    { key: 'petName', placeholder: 'Pet Name' },
  ] as const;

  const handlePetInfo = () => {
    createPet(
      { name: pet.petName, weight: parseFloat(pet.petWeight), breed: pet.petBreed },
      {
        onSuccess: (pet) => navigation.navigate('AddPetPhoto', { petId: pet.id }),
        onError: (err: any) =>
          showToast(err?.response?.data?.message ?? 'Failed to add pet', 'error'),
      },
    );
  };

  return (
    <>
      <View style={common.screenContainer}>
        <Text style={[typography.h2, common.title]}>
          Add your pet
        </Text>
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
            autoCapitalize="none"
          />
        ))}
        <View style={[common.input, styles.inputWithSuffix]}>
          <TextInput
            style={styles.innerInput}
            placeholder="Pet Weight"
            placeholderTextColor={colors.stroke}
            value={pet.petWeight}
            onChangeText={(text) => setPet({ ...pet, petWeight: text })}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>kg</Text>
        </View>
        <Dropdown
          placeholder="Breed"
          options={breedOptions}
          value={pet.petBreed}
          onSelect={(value) => setPet({ ...pet, petBreed: value })}
        />

        <TouchableOpacity
          style={[common.button, { backgroundColor: colors.accent }]}
          onPress={handlePetInfo}
          disabled={isPending}
        >
          <Text style={[typography.bodyBold, { color: colors.background }]}>
            {isPending ? 'Adding…' : 'Add Pet'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.backContainer]}>
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.navigate('Login')}
        >
            <MaterialIcons name="keyboard-backspace" size={24} color={colors.accent} />
          <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: "500" }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputWithSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.md,
  },
  innerInput: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 14,
  },
  suffix: {
    fontSize: 14,
    color: colors.stroke,
    fontWeight: '500',
    paddingRight: spacing.lg,
  },
  backContainer: {
    backgroundColor: colors.background,
    paddingBottom: spacing.md,
    paddingLeft: spacing.xxl,
  },
  backButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
});
