import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ToggleSwitchProps = {
  value: boolean;
  onToggle: () => void;
};

export default function ToggleSwitch({ value, onToggle }: ToggleSwitchProps) {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 20 : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.container,
        { backgroundColor: value ? colors.primary : 'rgba(120, 120, 128, 0.16)' },
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.circle,
          { 
            backgroundColor: colors.surface,
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
});