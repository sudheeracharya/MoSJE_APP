import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Message } from '@/context/ChatContext';
import FileAttachment from './FileAttachment';

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const isUser = message.sender === 'user';
  const date = new Date(message.timestamp);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.messageContainer,
          isUser 
            ? [styles.userMessage, { backgroundColor: colors.primary }] 
            : [styles.botMessage, { backgroundColor: colors.surface }],
        ]}
      >
        {message.attachments && message.attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            {message.attachments.map((file, index) => (
              <FileAttachment key={index} file={file} />
            ))}
          </View>
        )}
        <Text
          style={[
            styles.messageText,
            { color: isUser ? 'white' : colors.text },
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            styles.timeText,
            { color: isUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary },
          ]}
        >
          {time}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  messageContainer: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  botMessage: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: 'Inter-Regular',
  },
  attachmentsContainer: {
    marginBottom: 8,
  },
});