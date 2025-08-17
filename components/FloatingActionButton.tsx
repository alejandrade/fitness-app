import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <ThemedText style={styles.fabText}>+</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
