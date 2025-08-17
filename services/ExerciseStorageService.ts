import { CompletedWorkout, Exercise, WorkoutSession } from '@/types/exercise';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXERCISES_STORAGE_KEY = '@fitness_app_exercises';
const COMPLETED_WORKOUTS_KEY = '@fitness_app_completed_workouts';
const WORKOUT_SESSIONS_KEY = '@fitness_app_workout_sessions';

export class ExerciseStorageService {
  /**
   * Save exercises to persistent storage
   */
  static async saveExercises(exercises: Exercise[]): Promise<void> {
    try {
      const exercisesJson = JSON.stringify(exercises);
      await AsyncStorage.setItem(EXERCISES_STORAGE_KEY, exercisesJson);
    } catch (error) {
      console.error('Failed to save exercises:', error);
      throw new Error('Failed to save exercises to storage');
    }
  }

  /**
   * Load exercises from persistent storage
   */
  static async loadExercises(): Promise<Exercise[]> {
    try {
      const exercisesJson = await AsyncStorage.getItem(EXERCISES_STORAGE_KEY);
      
      if (!exercisesJson) {
        return [];
      }

      const exercises = JSON.parse(exercisesJson);
      
      // Convert string dates back to Date objects
      return exercises.map((exercise: any) => ({
        ...exercise,
        createdAt: new Date(exercise.createdAt)
      }));
    } catch (error) {
      console.error('Failed to load exercises:', error);
      // Return empty array if loading fails, so app can still function
      return [];
    }
  }

  /**
   * Add a single exercise to storage
   */
  static async addExercise(exercise: Exercise): Promise<void> {
    try {
      const existingExercises = await this.loadExercises();
      const updatedExercises = [exercise, ...existingExercises];
      await this.saveExercises(updatedExercises);
    } catch (error) {
      console.error('Failed to add exercise:', error);
      throw new Error('Failed to add exercise to storage');
    }
  }

  /**
   * Remove an exercise from storage
   */
  static async removeExercise(exerciseId: string): Promise<void> {
    try {
      const existingExercises = await this.loadExercises();
      const updatedExercises = existingExercises.filter(ex => ex.id !== exerciseId);
      await this.saveExercises(updatedExercises);
    } catch (error) {
      console.error('Failed to remove exercise:', error);
      throw new Error('Failed to remove exercise from storage');
    }
  }

  /**
   * Update an existing exercise
   */
  static async updateExercise(updatedExercise: Exercise): Promise<void> {
    try {
      const existingExercises = await this.loadExercises();
      const updatedExercises = existingExercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      );
      await this.saveExercises(updatedExercises);
    } catch (error) {
      console.error('Failed to update exercise:', error);
      throw new Error('Failed to update exercise in storage');
    }
  }

  /**
   * Mark an exercise as completed (1 set done)
   */
  static async completeExerciseSet(exerciseId: string): Promise<{ exercise: Exercise; isFullyCompleted: boolean }> {
    try {
      const existingExercises = await this.loadExercises();
      const exerciseIndex = existingExercises.findIndex(ex => ex.id === exerciseId);
      
      if (exerciseIndex === -1) {
        throw new Error('Exercise not found');
      }

      const exercise = existingExercises[exerciseIndex];
      const updatedExercise = { ...exercise, sets: exercise.sets - 1 };
      
      let isFullyCompleted = false;
      let updatedExercises: Exercise[];

      if (updatedExercise.sets <= 0) {
        // Exercise is fully completed, remove it
        updatedExercises = existingExercises.filter(ex => ex.id !== exerciseId);
        isFullyCompleted = true;
      } else {
        // Update the exercise with remaining sets
        updatedExercises = [...existingExercises];
        updatedExercises[exerciseIndex] = updatedExercise;
      }

      // Save the updated exercises list
      await this.saveExercises(updatedExercises);
      
      return { exercise, isFullyCompleted };
    } catch (error) {
      console.error('Failed to complete exercise set:', error);
      throw new Error('Failed to complete exercise set');
    }
  }

  /**
   * Save a completed workout
   */
  static async saveCompletedWorkout(completedWorkout: CompletedWorkout): Promise<void> {
    try {
      const existingWorkouts = await this.loadCompletedWorkouts();
      const updatedWorkouts = [completedWorkout, ...existingWorkouts];
      
      // Save the updated workouts array to storage
      const workoutsJson = JSON.stringify(updatedWorkouts);
      await AsyncStorage.setItem(COMPLETED_WORKOUTS_KEY, workoutsJson);
    } catch (error) {
      console.error('Failed to save completed workout:', error);
      throw new Error('Failed to save completed workout');
    }
  }

  /**
   * Save completed workouts array directly
   */
  static async saveCompletedWorkouts(completedWorkouts: CompletedWorkout[]): Promise<void> {
    try {
      const workoutsJson = JSON.stringify(completedWorkouts);
      await AsyncStorage.setItem(COMPLETED_WORKOUTS_KEY, workoutsJson);
    } catch (error) {
      console.error('Failed to save completed workouts:', error);
      throw new Error('Failed to save completed workouts');
    }
  }

  /**
   * Load completed workouts from storage
   */
  static async loadCompletedWorkouts(): Promise<CompletedWorkout[]> {
    try {
      const workoutsJson = await AsyncStorage.getItem(COMPLETED_WORKOUTS_KEY);
      
      if (!workoutsJson) {
        return [];
      }

      const workouts = JSON.parse(workoutsJson);
      
      // Convert string dates back to Date objects
      return workouts.map((workout: any) => ({
        ...workout,
        completedAt: new Date(workout.completedAt)
      }));
    } catch (error) {
      console.error('Failed to load completed workouts:', error);
      return [];
    }
  }

  /**
   * Save workout sessions
   */
  static async saveWorkoutSessions(sessions: WorkoutSession[]): Promise<void> {
    try {
      const sessionsJson = JSON.stringify(sessions);
      await AsyncStorage.setItem(WORKOUT_SESSIONS_KEY, sessionsJson);
    } catch (error) {
      console.error('Failed to save workout sessions:', error);
      throw new Error('Failed to save workout sessions');
    }
  }

  /**
   * Load workout sessions from storage
   */
  static async loadWorkoutSessions(): Promise<WorkoutSession[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(WORKOUT_SESSIONS_KEY);
      
      if (!sessionsJson) {
        return [];
      }

      const sessions = JSON.parse(sessionsJson);
      
      // Convert string dates back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        exercises: session.exercises.map((exercise: any) => ({
          ...exercise,
          completedAt: new Date(exercise.completedAt)
        }))
      }));
    } catch (error) {
      console.error('Failed to load workout sessions:', error);
      return [];
    }
  }

  /**
   * Create a new workout session
   */
  static async createWorkoutSession(): Promise<WorkoutSession> {
    try {
      const newSession: WorkoutSession = {
        id: Date.now().toString(),
        startTime: new Date(),
        exercises: [],
        totalExercises: 0,
        totalReps: 0,
        totalSets: 0
      };

      const existingSessions = await this.loadWorkoutSessions();
      const updatedSessions = [newSession, ...existingSessions];
      await this.saveWorkoutSessions(updatedSessions);

      return newSession;
    } catch (error) {
      console.error('Failed to create workout session:', error);
      throw new Error('Failed to create workout session');
    }
  }

  /**
   * Add exercise to workout session
   */
  static async addExerciseToSession(sessionId: string, exercise: Exercise): Promise<void> {
    try {
      const sessions = await this.loadWorkoutSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        throw new Error('Workout session not found');
      }

      const session = sessions[sessionIndex];
      const completedWorkout: CompletedWorkout = {
        id: Date.now().toString(),
        exerciseName: exercise.name,
        repetitions: exercise.repetitions,
        sets: exercise.sets,
        completedAt: new Date(),
        workoutSessionId: sessionId
      };

      // Add to completed workouts
      await this.saveCompletedWorkout(completedWorkout);

      // Update session
      const updatedSession = {
        ...session,
        exercises: [...session.exercises, completedWorkout],
        totalExercises: session.totalExercises + 1,
        totalReps: session.totalReps + exercise.repetitions,
        totalSets: session.totalSets + exercise.sets
      };

      sessions[sessionIndex] = updatedSession;
      await this.saveWorkoutSessions(sessions);
    } catch (error) {
      console.error('Failed to add exercise to session:', error);
      throw new Error('Failed to add exercise to session');
    }
  }

  /**
   * Clear all exercises from storage
   */
  static async clearAllExercises(): Promise<void> {
    try {
      await AsyncStorage.removeItem(EXERCISES_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear exercises:', error);
      throw new Error('Failed to clear exercises from storage');
    }
  }

  /**
   * Get storage statistics
   */
  static async getStorageInfo(): Promise<{ 
    totalExercises: number; 
    totalReps: number; 
    totalSets: number;
    totalCompletedWorkouts: number;
    totalWorkoutSessions: number;
  }> {
    try {
      const exercises = await this.loadExercises();
      const completedWorkouts = await this.loadCompletedWorkouts();
      const workoutSessions = await this.loadWorkoutSessions();

      const totalExercises = exercises.length;
      const totalReps = exercises.reduce((sum, ex) => sum + ex.repetitions, 0);
      const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
      const totalCompletedWorkouts = completedWorkouts.length;
      const totalWorkoutSessions = workoutSessions.length;
      
      return { 
        totalExercises, 
        totalReps, 
        totalSets, 
        totalCompletedWorkouts,
        totalWorkoutSessions
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { 
        totalExercises: 0, 
        totalReps: 0, 
        totalSets: 0, 
        totalCompletedWorkouts: 0,
        totalWorkoutSessions: 0
      };
    }
  }
}
