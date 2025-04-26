import React from 'react';
import { StyleSheet, View } from 'react-native';
import ChatScreen from '@/components/screens/ChatScreen';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});