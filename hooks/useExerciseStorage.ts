import { ExerciseStorageService } from '@/services/ExerciseStorageService';
import { CompletedWorkout, Exercise, ExerciseFormData, WorkoutSession } from '@/types/exercise';
import { useCallback, useEffect, useState } from 'react';

export function useExerciseStorage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load exercises from storage on component mount
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  const loadDataFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [storedExercises, storedCompletedWorkouts, storedWorkoutSessions] = await Promise.all([
        ExerciseStorageService.loadExercises(),
        ExerciseStorageService.loadCompletedWorkouts(),
        ExerciseStorageService.loadWorkoutSessions()
      ]);
      
      setExercises(storedExercises);
      setCompletedWorkouts(storedCompletedWorkouts);
      setWorkoutSessions(storedWorkoutSessions);
      
      // Check if there's an active session
      const activeSession = storedWorkoutSessions.find(s => !s.endTime);
      setCurrentSession(activeSession || null);
    } catch (err) {
      setError('Failed to load data from storage');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addExercise = useCallback(async (formData: ExerciseFormData) => {
    try {
      setError(null);
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: formData.name,
        repetitions: formData.repetitions,
        sets: formData.sets,
        createdAt: new Date(),
      };

      // Add to storage first
      await ExerciseStorageService.addExercise(newExercise);
      
      // Then update local state
      setExercises(prev => [newExercise, ...prev]);
      
      return newExercise;
    } catch (err) {
      setError('Failed to add exercise');
      console.error('Error adding exercise:', err);
      throw err;
    }
  }, []);

  const removeExercise = useCallback(async (exerciseId: string) => {
    try {
      setError(null);
      
      // Remove from storage first
      await ExerciseStorageService.removeExercise(exerciseId);
      
      // Then update local state
      setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    } catch (err) {
      setError('Failed to remove exercise');
      console.error('Error removing exercise:', err);
      throw err;
    }
  }, []);

  const completeExerciseSet = useCallback(async (exerciseId: string) => {
    try {
      setError(null);
      
      // Ensure we have an active session
      let session = currentSession;
      if (!session) {
        session = await ExerciseStorageService.createWorkoutSession();
        setCurrentSession(session);
        setWorkoutSessions(prev => [session, ...prev]);
      }

      // Complete the exercise set using the service
      const result = await ExerciseStorageService.completeExerciseSet(exerciseId);
      
      // Update local state based on the result
      if (result.isFullyCompleted) {
        // Exercise is fully completed, remove it from the list
        setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
        
        // Add to completed workouts
        const completedWorkout: CompletedWorkout = {
          id: Date.now().toString(),
          exerciseName: result.exercise.name,
          repetitions: result.exercise.repetitions,
          sets: result.exercise.sets,
          completedAt: new Date(),
          workoutSessionId: session.id
        };
        
        // Update local state first
        const newCompletedWorkouts = [completedWorkout, ...completedWorkouts];
        setCompletedWorkouts(newCompletedWorkouts);
        
        // Save to storage
        await ExerciseStorageService.saveCompletedWorkouts(newCompletedWorkouts);
        
        // Update the session
        setWorkoutSessions(prev => {
          const updatedSessions = prev.map(s => {
            if (s.id === session.id) {
              return {
                ...s,
                exercises: [...s.exercises, completedWorkout],
                totalExercises: s.totalExercises + 1,
                totalReps: s.totalReps + result.exercise.repetitions,
                totalSets: s.totalSets + result.exercise.sets
              };
            }
            return s;
          });
          return updatedSessions;
        });
      } else {
        // Update the exercise with remaining sets
        setExercises(prev => prev.map(ex => 
          ex.id === exerciseId ? { ...ex, sets: ex.sets - 1 } : ex
        ));
      }
      
      return result;
    } catch (err) {
      setError('Failed to complete exercise set');
      console.error('Error completing exercise set:', err);
      throw err;
    }
  }, [currentSession, completedWorkouts]);

  const startNewWorkoutSession = useCallback(async () => {
    try {
      setError(null);
      
      // End current session if exists
      if (currentSession) {
        const updatedSessions = workoutSessions.map(s => 
          s.id === currentSession.id ? { ...s, endTime: new Date() } : s
        );
        setWorkoutSessions(updatedSessions);
        setCurrentSession(null);
      }
      
      // Create new session
      const newSession = await ExerciseStorageService.createWorkoutSession();
      setCurrentSession(newSession);
      setWorkoutSessions(prev => [newSession, ...prev]);
      
      return newSession;
    } catch (err) {
      setError('Failed to start new workout session');
      console.error('Error starting new session:', err);
      throw err;
    }
  }, [currentSession, workoutSessions]);

  const endCurrentSession = useCallback(async () => {
    try {
      setError(null);
      
      if (currentSession) {
        const updatedSessions = workoutSessions.map(s => 
          s.id === currentSession.id ? { ...s, endTime: new Date() } : s
        );
        setWorkoutSessions(updatedSessions);
        setCurrentSession(null);
      }
    } catch (err) {
      setError('Failed to end workout session');
      console.error('Error ending session:', err);
      throw err;
    }
  }, [currentSession, workoutSessions]);

  const updateExercise = useCallback(async (updatedExercise: Exercise) => {
    try {
      setError(null);
      
      // Update in storage first
      await ExerciseStorageService.updateExercise(updatedExercise);
      
      // Then update local state
      setExercises(prev => prev.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      ));
    } catch (err) {
      setError('Failed to update exercise');
      console.error('Error updating exercise:', err);
      throw err;
    }
  }, []);

  const clearAllExercises = useCallback(async () => {
    try {
      setError(null);
      
      // Clear from storage first
      await ExerciseStorageService.clearAllExercises();
      
      // Then update local state
      setExercises([]);
    } catch (err) {
      setError('Failed to clear exercises');
      console.error('Error clearing exercises:', err);
      throw err;
    }
  }, []);

  const refreshData = useCallback(() => {
    loadDataFromStorage();
  }, [loadDataFromStorage]);

  return {
    exercises,
    completedWorkouts,
    workoutSessions,
    currentSession,
    isLoading,
    error,
    addExercise,
    removeExercise,
    updateExercise,
    completeExerciseSet,
    startNewWorkoutSession,
    endCurrentSession,
    clearAllExercises,
    refreshData,
  };
}
