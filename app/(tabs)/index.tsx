import { ExerciseForm } from '@/components/ExerciseForm';
import { ExerciseItem } from '@/components/ExerciseItem';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useExerciseStorage } from '@/hooks/useExerciseStorage';
import { Exercise, ExerciseFormData } from '@/types/exercise';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCompletingExercise, setIsCompletingExercise] = useState<string | null>(null);
  const { 
    exercises, 
    isLoading, 
    error, 
    addExercise,
    removeExercise,
    completeExerciseSet,
    currentSession,
    startNewWorkoutSession,
    endCurrentSession
  } = useExerciseStorage();

  const handleAddExercise = async (formData: ExerciseFormData) => {
    try {
      await addExercise(formData);
      setIsFormVisible(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to save exercise. Please try again.');
    }
  };

  const handleCompleteSet = async (exerciseId: string) => {
    // Prevent multiple rapid clicks
    if (isCompletingExercise === exerciseId) {
      return;
    }

    try {
      setIsCompletingExercise(exerciseId);
      await completeExerciseSet(exerciseId);
    } catch (err) {
      Alert.alert('Error', 'Failed to complete exercise set. Please try again.');
    } finally {
      setIsCompletingExercise(null);
    }
  };

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <ExerciseItem 
      exercise={item} 
      onDelete={removeExercise}
      onCompleteSet={handleCompleteSet}
      isCompleting={isCompletingExercise === item.id}
    />
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ecdc4" />
        <ThemedText style={styles.loadingText}>Loading exercises...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <ThemedText style={styles.errorSubtext}>
          Your exercises are still available, but there was an issue loading them.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">My Workout</ThemedText>
        <ThemedText style={styles.subtitle}>
          Track your exercises and progress
        </ThemedText>
        
        {/* Workout Session Controls */}
        <View style={styles.sessionControls}>
          {currentSession ? (
            <View style={styles.sessionInfo}>
              <IconSymbol size={20} name="play.circle.fill" color="#4ecdc4" />
              <ThemedText style={styles.sessionText}>
                Workout in progress
              </ThemedText>
              <TouchableOpacity 
                style={styles.endSessionButton}
                onPress={endCurrentSession}
              >
                <ThemedText style={styles.endSessionText}>End</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.startSessionButton}
              onPress={startNewWorkoutSession}
            >
              <IconSymbol size={20} name="play.circle.fill" color="white" />
              <ThemedText style={styles.startSessionText}>Start Workout</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {exercises.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            {currentSession 
              ? "Great job! You've completed all your exercises for this workout."
              : "No exercises yet. Tap the + button to add your first exercise!"
            }
          </ThemedText>
          {currentSession && (
            <TouchableOpacity 
              style={styles.endSessionButton}
              onPress={endCurrentSession}
            >
              <ThemedText style={styles.endSessionText}>End Workout Session</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FloatingActionButton onPress={openForm} />
      
      <ExerciseForm
        visible={isFormVisible}
        onClose={closeForm}
        onSubmit={handleAddExercise}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  sessionControls: {
    marginTop: 16,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  sessionText: {
    color: '#4ecdc4',
    fontWeight: '600',
  },
  startSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startSessionText: {
    color: 'white',
    fontWeight: '600',
  },
  endSessionButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  endSessionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 100, // Space for FAB
  },
});
