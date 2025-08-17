import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useExerciseStorage } from '@/hooks/useExerciseStorage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function ProgressScreen() {
  const { 
    exercises, 
    completedWorkouts, 
    workoutSessions, 
    isLoading, 
    refreshData 
  } = useExerciseStorage();
  const [stats, setStats] = useState({
    totalExercises: 0,
    totalReps: 0,
    totalSets: 0,
    workoutDays: 0,
    totalCompletedWorkouts: 0,
    totalWorkoutSessions: 0
  });

  // Refresh data when this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  useEffect(() => {
    console.log('Progress Screen - Data Updated:', {
      exercisesCount: exercises.length,
      completedWorkoutsCount: completedWorkouts.length,
      workoutSessionsCount: workoutSessions.length,
      exercises: exercises.map(ex => ({ name: ex.name, sets: ex.sets, reps: ex.repetitions })),
      completedWorkouts: completedWorkouts.map(w => ({ name: w.exerciseName, sets: w.sets, reps: w.repetitions, date: w.completedAt }))
    });

    if (exercises.length > 0 || completedWorkouts.length > 0 || workoutSessions.length > 0) {
      const totalExercises = exercises.length;
      const totalReps = exercises.reduce((sum, ex) => sum + ex.repetitions, 0);
      const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
      
      // Calculate unique workout days from completed workouts
      const uniqueDays = new Set(
        completedWorkouts.map(w => w.completedAt.toDateString())
      );
      const workoutDays = uniqueDays.size;

      const totalCompletedWorkouts = completedWorkouts.length;
      const totalWorkoutSessions = workoutSessions.length;

      const newStats = { 
        totalExercises, 
        totalReps, 
        totalSets, 
        workoutDays,
        totalCompletedWorkouts,
        totalWorkoutSessions
      };

      console.log('Progress Screen - New Stats:', newStats);
      setStats(newStats);
    } else {
      // Reset stats when no data
      const resetStats = {
        totalExercises: 0,
        totalReps: 0,
        totalSets: 0,
        workoutDays: 0,
        totalCompletedWorkouts: 0,
        totalWorkoutSessions: 0
      };
      console.log('Progress Screen - Reset Stats:', resetStats);
      setStats(resetStats);
    }
  }, [exercises, completedWorkouts, workoutSessions]);

  const renderCompletedWorkout = ({ item }: { item: any }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <ThemedText type="defaultSemiBold" style={styles.workoutName}>
          {item.exerciseName}
        </ThemedText>
        <ThemedText style={styles.workoutDate}>
          {item.completedAt.toLocaleDateString()}
        </ThemedText>
      </View>
      <View style={styles.workoutDetails}>
        <View style={styles.workoutDetailItem}>
          <IconSymbol size={16} name="repeat" color="#ff6b6b" />
          <ThemedText style={styles.workoutDetailText}>
            {item.repetitions} reps
          </ThemedText>
        </View>
        <View style={styles.workoutDetailItem}>
          <IconSymbol size={16} name="flame.fill" color="#feca57" />
          <ThemedText style={styles.workoutDetailText}>
            {item.sets} sets
          </ThemedText>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ecdc4" />
          <ThemedText style={styles.loadingText}>Loading progress...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <IconSymbol
          size={80}
          color="#4ecdc4"
          name="chart.bar.fill"
          style={styles.headerIcon}
        />
        <ThemedText type="title">Progress</ThemedText>
        <ThemedText style={styles.subtitle}>
          Track your fitness journey
        </ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <IconSymbol size={32} color="#4ecdc4" name="flame.fill" />
          <ThemedText style={styles.statNumber}>{stats.totalExercises}</ThemedText>
          <ThemedText style={styles.statLabel}>Planned</ThemedText>
        </View>

        <View style={styles.statCard}>
          <IconSymbol size={32} color="#ff6b6b" name="checkmark.circle.fill" />
          <ThemedText style={styles.statNumber}>{stats.totalCompletedWorkouts}</ThemedText>
          <ThemedText style={styles.statLabel}>Completed</ThemedText>
        </View>

        <View style={styles.statCard}>
          <IconSymbol size={32} color="#feca57" name="calendar" />
          <ThemedText style={styles.statNumber}>{stats.workoutDays}</ThemedText>
          <ThemedText style={styles.statLabel}>Workout Days</ThemedText>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Recent Workouts</ThemedText>
      </View>

      {completedWorkouts.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            No completed workouts yet. Start a workout session and complete some exercises!
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={completedWorkouts.slice(0, 10)} // Show last 10
          renderItem={renderCompletedWorkout}
          keyExtractor={(item) => item.id}
          style={styles.workoutList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.infoContainer}>
        <ThemedText style={styles.infoTitle}>Getting Started</ThemedText>
        <ThemedText style={styles.infoText}>
          {stats.totalCompletedWorkouts === 0 
            ? "Start a workout session on the Workout tab, then tap exercises to complete them one set at a time!"
            : `Great job! You've completed ${stats.totalCompletedWorkouts} exercises across ${stats.workoutDays} workout days.`
          }
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  headerIcon: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4ecdc4',
  },
  workoutList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  workoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
  },
  workoutDate: {
    fontSize: 12,
    color: '#666',
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  workoutDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workoutDetailText: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});
