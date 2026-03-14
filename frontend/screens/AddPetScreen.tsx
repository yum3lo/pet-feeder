import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, common } from '@/style';
import Dropdown from '@/components/Dropdown';
import breedOptions from '@/data/breeds.json';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';


type Props = NativeStackScreenProps<RootStackParamList, 'AddPet'>;

export default function AddPetScreen({ navigation }: Props) {
  const [pet, setPet] = useState({petName: '', petWeight: '', petAge: '', petBreed:''});
  const [ageUnit, setAgeUnit] = useState<'months' | 'years'>('months');

  const petFields = [
    { key: 'petName', placeholder: 'Pet Name' },
  ] as const;

  const handlePetInfo = () => {
    console.log('Pet Info', pet);
  }

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
        <View style={styles.inputRow}>
          <TextInput
            style={[common.input, styles.inputFlex]}
            placeholder="Pet Age"
            placeholderTextColor={colors.stroke}
            value={pet.petAge}
            onChangeText={(text) => setPet({ ...pet, petAge: text })}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.unitButton, ageUnit === 'months' && styles.unitButtonActive]}
            onPress={() => setAgeUnit('months')}
          >
            <Text style={[styles.unitText, ageUnit === 'months' && styles.unitTextActive]}>Months</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, ageUnit === 'years' && styles.unitButtonActive]}
            onPress={() => setAgeUnit('years')}
          >
            <Text style={[styles.unitText, ageUnit === 'years' && styles.unitTextActive]}>Years</Text>
          </TouchableOpacity>
        </View>
        <Dropdown
          placeholder="Breed"
          options={breedOptions}
          value={pet.petBreed}
          onSelect={(value) => setPet({ ...pet, petBreed: value })}
        />

        <TouchableOpacity
          style={[common.button, { backgroundColor: colors.accent }]}
           onPress={() => navigation.navigate('AddPetPhoto')}
        >
          <Text style={[typography.bodyBold, { color: colors.background }]}>Add Pet</Text>
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
  inputRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  inputFlex: {
    flex: 1,
    marginBottom: 0,
  },
  unitButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  unitButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  unitText: {
    fontSize: 13,
    color: colors.stroke,
    fontWeight: '500',
  },
  unitTextActive: {
    color: colors.background,
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
