import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
const darkTheme = {
  primary: '#4285F4',
  secondary: '#BB86FC',
  accent: '#03DAC6',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#2D2D2D',
  disabled: '#5C5C5C',
  divider: '#2D2D2D',
  cardBackground: '#1E1E1E',
  red: '#FF453A',
  green: '#32D74B',
};

const lightTheme = {
  primary: '#1A73E8',
  secondary: '#6200EE',
  accent: '#03DAC6',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#121212',
  textSecondary: '#666666',
  border: '#E0E0E0',
  disabled: '#9E9E9E',
  divider: '#E0E0E0',
  cardBackground: '#FFFFFF',
  red: '#FF3B30',
  green: '#34C759',
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof darkTheme;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  colors: darkTheme,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('isDarkMode');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'true');
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('isDarkMode', String(newMode));
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};