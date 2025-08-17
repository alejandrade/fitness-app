import { Exercise } from '@/types/exercise';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface ExerciseItemProps {
  exercise: Exercise;
  onDelete?: (exerciseId: string) => void;
  onCompleteSet?: (exerciseId: string) => void;
  isCompleting?: boolean;
}

export function ExerciseItem({ exercise, onDelete, onCompleteSet, isCompleting }: ExerciseItemProps) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Exercise',
      `Are you sure you want to delete "${exercise.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete?.(exercise.id)
        }
      ]
    );
  };

  const handleCompleteSet = () => {
    if (onCompleteSet && !isCompleting) {
      onCompleteSet(exercise.id);
    }
  };

  const isClickable = !!onCompleteSet && !isCompleting;

  return (
    <TouchableOpacity 
      onPress={isClickable ? handleCompleteSet : undefined}
      activeOpacity={isClickable ? 0.7 : 1}
      style={[
        styles.container,
        isClickable && styles.clickableContainer,
        isCompleting && styles.completingContainer
      ]}
      disabled={isCompleting}
    >
      <ThemedView style={styles.innerContainer}>
        <View style={styles.header}>
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {exercise.name}
          </ThemedText>
          <View style={styles.headerRight}>
            <ThemedText style={styles.date}>
              {exercise.createdAt.toLocaleDateString()}
            </ThemedText>
            {onDelete && (
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <IconSymbol size={16} name="trash.fill" color="#ff6b6b" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <ThemedText style={styles.label}>Reps:</ThemedText>
            <ThemedText style={styles.value}>{exercise.repetitions}</ThemedText>
          </View>
          
          <View style={styles.detailItem}>
            <ThemedText style={styles.label}>Sets:</ThemedText>
            <ThemedText style={styles.value}>{exercise.sets}</ThemedText>
          </View>
        </View>

        {onCompleteSet && (
          <View style={styles.completionHint}>
            {isCompleting ? (
              <>
                <ActivityIndicator size={16} color="#4ecdc4" />
                <ThemedText style={styles.completionText}>
                  Completing...
                </ThemedText>
              </>
            ) : (
              <>
                <IconSymbol size={16} name="checkmark.circle.fill" color="#4ecdc4" />
                <ThemedText style={styles.completionText}>
                  Tap to complete 1 set
                </ThemedText>
              </>
            )}
          </View>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  clickableContainer: {
    // Add subtle shadow for clickable items
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  completingContainer: {
    opacity: 0.7, // Indicate that it's in a loading state
  },
  innerContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 4,
  },
  details: {
    flexDirection: 'row',
    gap: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  completionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  completionText: {
    fontSize: 14,
    color: '#4ecdc4',
    fontStyle: 'italic',
  },
});
