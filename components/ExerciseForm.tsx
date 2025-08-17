import { useThemeColor } from '@/hooks/useThemeColor';
import { ExerciseFormData } from '@/types/exercise';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ExerciseFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (exercise: ExerciseFormData) => void;
}

export function ExerciseForm({ visible, onClose, onSubmit }: ExerciseFormProps) {
  const [formData, setFormData] = useState<ExerciseFormData>({
    name: '',
    repetitions: 0,
    sets: 0,
  });

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }
    if (formData.repetitions <= 0) {
      Alert.alert('Error', 'Repetitions must be greater than 0');
      return;
    }
    if (formData.sets <= 0) {
      Alert.alert('Error', 'Sets must be greater than 0');
      return;
    }

    onSubmit(formData);
    setFormData({ name: '', repetitions: 0, sets: 0 });
    onClose();
  };

  const handleCancel = () => {
    setFormData({ name: '', repetitions: 0, sets: 0 });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.modalContainer, { backgroundColor }]}>
          <ThemedText type="title" style={styles.title}>
            Add New Exercise
          </ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Exercise Name</ThemedText>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: useThemeColor({}, 'background'),
                  borderColor,
                  color: textColor
                }
              ]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter exercise name"
              placeholderTextColor={useThemeColor({}, 'icon')}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Repetitions</ThemedText>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: useThemeColor({}, 'background'),
                  borderColor,
                  color: textColor
                }
              ]}
              value={formData.repetitions.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                setFormData({ ...formData, repetitions: num });
              }}
              placeholder="0"
              placeholderTextColor={useThemeColor({}, 'icon')}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Sets</ThemedText>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: useThemeColor({}, 'background'),
                  borderColor,
                  color: textColor
                }
              ]}
              value={formData.sets.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                setFormData({ ...formData, sets: num });
              }}
              placeholder="0"
              placeholderTextColor={useThemeColor({}, 'icon')}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <ThemedText style={styles.buttonText}>Add Exercise</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4ecdc4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
