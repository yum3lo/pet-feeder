import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Modal,
  TextInput, Image, KeyboardAvoidingView, Platform,
} from 'react-native';

import { Dropdown, ActionButtons } from '@/components';
import DietaryRestrictionsField from '@/components/pet/DietaryRestrictionsField';
import { useToast } from '@/contexts';
import catBreeds from '@/data/cat_breeds.json';
import dogBreeds from '@/data/dog_breeds.json';
import { colors, typography, spacing, radius } from '@/style';

export type PetData = {
  name: string;
  breed: string;
  weight: string;
  photo: string | null;
  species: string;
  dietaryRestrictions: string[];
};

type Props = {
  visible: boolean;
  initialData?: PetData | null;
  onSave: (data: PetData) => void;
  onClose: () => void;
};

const DEFAULT: PetData = { name: '', breed: '', weight: '', photo: null, species: '', dietaryRestrictions: [] };

export default function AddPetModal({ visible, initialData, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<PetData>(DEFAULT);
  const { showToast } = useToast();

  useEffect(() => {
    setDraft(initialData ?? DEFAULT);
  }, [visible, initialData]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setDraft((prev) => ({ ...prev, photo: result.assets[0].uri }));
    }
  };

  const handleSave = () => {
    const saved = { ...draft, name: draft.name.trim(), weight: draft.weight.trim() };
    if (!saved.name) {
      showToast('Please enter a name for your pet.', 'error');
      return;
    }
    onSave(saved);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.h3, { color: colors.text }]}>{initialData ? 'Edit pet' : 'Add a pet'}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="close" size={24} color={colors.stroke} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
            {draft.photo ? (
              <Image source={{ uri: draft.photo }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialIcons name="add-a-photo" size={32} color={colors.stroke} />
                <Text style={[typography.bodySmall, { color: colors.stroke, marginTop: spacing.sm }]}>
                  Profile photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={colors.stroke}
            value={draft.name}
            onChangeText={(v) => setDraft((p) => ({ ...p, name: v }))}
          />

          <View style={[styles.input, styles.speciesRow]}>
            <Text style={styles.speciesLabel}>Your pet is a</Text>
            <View style={styles.speciesButtons}>
              {(['Cat', 'Dog'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.speciesButton,
                    draft.species === s.toLowerCase() && styles.speciesButtonActive,
                  ]}
                  onPress={() => setDraft((p) => ({ ...p, species: s.toLowerCase(), breed: '' }))}
                >
                  <Text
                    style={[
                      styles.speciesButtonText,
                      draft.species === s.toLowerCase() && styles.speciesButtonTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Dropdown
            placeholder="Breed"
            options={(draft.species === 'cat' ? catBreeds : draft.species === 'dog' ? dogBreeds : []) as { label: string; value: string }[]}
            value={draft.breed}
            onSelect={(v) => setDraft((p) => ({ ...p, breed: v }))}
            style={{ width: '100%' }}
          />

          <View style={[styles.input, styles.weightInput]}>
            <TextInput
              style={styles.weightInner}
              placeholder="Weight"
              placeholderTextColor={colors.stroke}
              value={draft.weight}
              onChangeText={(v) => setDraft((p) => ({ ...p, weight: v }))}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>kg</Text>
          </View>

          <DietaryRestrictionsField
            value={draft.dietaryRestrictions}
            onChange={(v) => setDraft((p) => ({ ...p, dietaryRestrictions: v }))}
          />

          <ActionButtons
            leftLabel="Cancel"
            rightLabel="Save"
            onLeft={onClose}
            onRight={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  photoPicker: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  photoPreview: {
    width: 115,
    height: 115,
    borderRadius: 55,
  },
  photoPlaceholder: {
    width: 115,
    height: 115,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: colors.outline,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: radius.input,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  weightInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.md,
  },
  weightInner: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 16,
  },
  unit: {
    fontSize: 14,
    color: colors.stroke,
    fontWeight: '500',
    paddingRight: spacing.lg,
  },
  speciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speciesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.stroke,
  },
  speciesButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  speciesButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  speciesButtonActive: {
    borderBottomColor: colors.accent,
  },
  speciesButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.stroke,
  },
  speciesButtonTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  cancelButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  saveButton: {
    flex: 1,
    marginLeft: spacing.xl,
    width: undefined,
  },
});
