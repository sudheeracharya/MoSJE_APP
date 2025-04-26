import React from 'react';
import { StyleSheet, View } from 'react-native';
import SettingsScreen from '@/components/screens/SettingsScreen';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <SettingsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});