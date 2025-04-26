import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useChat, Message } from '@/context/ChatContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Menu,
  X,
  Send,
  FlipHorizontal as PaperclipHorizontal,
  AlignJustify,
} from 'lucide-react-native';
import Sidebar from '@/components/ui/Sidebar';
import ChatMessage from '@/components/ui/ChatMessage';
import * as DocumentPicker from 'expo-document-picker';
import FilePreview from '@/components/ui/FilePreview';

export default function ChatScreen() {
  const { colors } = useTheme();
  const { currentSession, sendMessage, isLoading } = useChat();
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [files, setFiles] = useState<
    { name: string; type: string; uri: string }[]
  >([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const sidebarAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  // Animate sidebar
  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: isSidebarOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen, sidebarAnim]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (currentSession?.messages.length) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [currentSession?.messages.length]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = async () => {
    if (message.trim() || files.length > 0) {
      await sendMessage(message, files.length > 0 ? files : undefined);
      setMessage('');
      setFiles([]);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'text/*'],
        multiple: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newFiles = result.assets.map((file) => ({
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          uri: file.uri,
        }));
        setFiles([...files, ...newFiles]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const removeFile = (uri: string) => {
    setFiles(files.filter((file) => file.uri !== uri));
  };

  // Calculate sidebar transform based on animation value
  const sidebarTranslate = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth * 0.8, 0],
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          {isSidebarOpen ? (
            <X size={24} color={colors.text} />
          ) : (
            <AlignJustify size={24} color={colors.text} />
          )}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          MoSJE APP
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {currentSession?.messages.map((msg: Message) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        )}
      </ScrollView>

      {/* File Previews */}
      {files.length > 0 && (
        <View
          style={[
            styles.filePreviewContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => removeFile(file.uri)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View
        style={[styles.inputContainer, { backgroundColor: colors.surface }]}
      >
        <TouchableOpacity onPress={pickDocument} style={styles.attachButton}>
          <PaperclipHorizontal size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Message MOSJE..."
          placeholderTextColor={colors.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={[
            styles.sendButton,
            { opacity: message.trim() || files.length > 0 ? 1 : 0.5 },
          ]}
          disabled={!(message.trim() || files.length > 0)}
        >
          <Send size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: colors.surface,
            transform: [{ translateX: sidebarTranslate }],
          },
        ]}
      >
        <Sidebar onClose={toggleSidebar} />
      </Animated.View>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  menuButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    padding: 8,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 120,
    borderWidth: 1,
  },
  attachButton: {
    padding: 10,
    marginRight: 8,
  },
  sendButton: {
    padding: 10,
    marginLeft: 8,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 50,
  },
  filePreviewContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});
