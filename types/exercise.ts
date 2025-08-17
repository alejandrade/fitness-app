export interface Exercise {
  id: string;
  name: string;
  repetitions: number;
  sets: number;
  createdAt: Date;
}

export interface ExerciseFormData {
  name: string;
  repetitions: number;
  sets: number;
}

export interface CompletedWorkout {
  id: string;
  exerciseName: string;
  repetitions: number;
  sets: number;
  completedAt: Date;
  workoutSessionId: string;
}

export interface WorkoutSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  exercises: CompletedWorkout[];
  totalExercises: number;
  totalReps: number;
  totalSets: number;
}
