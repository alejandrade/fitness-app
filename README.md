# Fitness Tracker App

A React Native fitness exercise tracking application built with Expo. This app allows users to plan workouts, track exercise completion, and monitor their fitness progress over time.

## 🏋️‍♂️ Features

### Core Functionality
- **Exercise Management**: Add, edit, and delete exercises with custom names, repetitions, and sets
- **Workout Tracking**: Mark exercises as completed one set at a time
- **Progress Monitoring**: View completed workouts and track fitness statistics
- **Persistent Storage**: All data is saved locally using AsyncStorage

### User Experience
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Real-time Updates**: Immediate feedback when completing exercises
- **Session Management**: Start and end workout sessions for organized tracking
- **Responsive Design**: Works seamlessly across different screen sizes

### Technical Features
- **TypeScript**: Fully typed for better development experience
- **Theme Support**: Light and dark mode compatibility
- **Cross-platform**: Built with React Native for iOS, Android, and web
- **State Management**: Efficient local state management with React hooks

## 📱 Screenshots

### Main Workout Screen
- Exercise list with completion tracking
- Floating action button to add new exercises
- Workout session controls

### Progress Screen
- Statistics dashboard
- Completed workout history
- Visual progress indicators

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fitness-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your device

## 🏗️ Project Structure

```
fitness-app/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Main workout screen
│   │   └── explore.tsx    # Progress tracking screen
│   └── _layout.tsx        # Root layout configuration
├── components/             # Reusable UI components
│   ├── ExerciseForm.tsx   # Exercise creation modal
│   ├── ExerciseItem.tsx   # Individual exercise display
│   ├── FloatingActionButton.tsx # Add exercise button
│   └── ui/                # UI component library
├── hooks/                  # Custom React hooks
│   └── useExerciseStorage.ts # Exercise data management
├── services/               # Business logic services
│   └── ExerciseStorageService.ts # Data persistence layer
├── types/                  # TypeScript type definitions
│   └── exercise.ts         # Exercise and workout types
└── constants/              # App constants and configuration
```

## 💾 Data Model

### Exercise
```typescript
interface Exercise {
  id: string;
  name: string;
  repetitions: number;
  sets: number;
  createdAt: Date;
}
```

### Completed Workout
```typescript
interface CompletedWorkout {
  id: string;
  exerciseName: string;
  repetitions: number;
  sets: number;
  completedAt: Date;
  workoutSessionId: string;
}
```

### Workout Session
```typescript
interface WorkoutSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  exercises: CompletedWorkout[];
  totalExercises: number;
  totalReps: number;
  totalSets: number;
}
```

## 🔧 Usage

### Adding Exercises
1. Tap the + button on the main screen
2. Fill in exercise name, repetitions, and sets
3. Tap "Add Exercise" to save

### Completing Workouts
1. Start a workout session (optional)
2. Tap any exercise to complete one set
3. Continue until all sets are completed
4. Exercise automatically removes when finished

### Viewing Progress
1. Switch to the Progress tab
2. View completed workout statistics
3. See workout history and trends

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **Storage**: AsyncStorage for local data persistence
- **Language**: TypeScript
- **State Management**: React hooks (useState, useEffect, useCallback)
- **UI Components**: Custom themed components with light/dark mode support

## 📊 Key Dependencies

- `expo`: ~53.0.20
- `react-native`: 0.79.5
- `@react-native-async-storage/async-storage`: ^1.24.0
- `expo-router`: ~5.1.4
- `react-native-reanimated`: ~3.17.4

## 🔍 Development Notes

### State Management
The app uses a custom hook (`useExerciseStorage`) that manages:
- Exercise data persistence
- Workout session tracking
- Completed workout history
- Real-time UI updates

### Data Persistence
- All data is stored locally using AsyncStorage
- Automatic data loading on app startup
- Real-time synchronization between screens

### Performance Considerations
- Optimistic UI updates for better user experience
- Efficient state updates using React hooks
- Minimal re-renders through proper dependency management

## 🚧 Known Limitations

- Data is stored locally only (no cloud sync)
- No user authentication or multi-user support
- Limited exercise customization options
- No workout templates or presets

## 🤝 Contributing

This is a sample project for demonstration purposes. Feel free to:
- Fork the repository
- Experiment with the code
- Use as a starting point for your own projects
- Report any issues you encounter

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
- UI components inspired by modern mobile design patterns
- Exercise tracking concepts based on common fitness app workflows

---

**Note**: This is a sample project intended for learning and demonstration purposes. It's not intended for production use without significant modifications and testing.
