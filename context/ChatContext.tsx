import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
  attachments?: {
    name: string;
    type: string;
    uri: string;
  }[];
};

export type ChatSession = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messages: Message[];
};

type ChatContextType = {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  createNewSession: () => void;
  setCurrentSession: (sessionId: string) => void;
  sendMessage: (content: string, attachments?: { name: string; type: string; uri: string }[]) => Promise<void>;
  clearHistory: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  isLoading: boolean;
};

const ChatContext = createContext<ChatContextType>({
  sessions: [],
  currentSession: null,
  createNewSession: () => {},
  setCurrentSession: () => {},
  sendMessage: async () => {},
  clearHistory: async () => {},
  deleteSession: async () => {},
  isLoading: false,
});

export const useChat = () => useContext(ChatContext);

// API URL from your FastAPI backend
const API_URL = 'http://127.0.0.1:8000';
const DEFAULT_USER_ID = 'user123'; // You might want to handle this dynamically based on authentication

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from the API
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/chat/history?user_id=${DEFAULT_USER_ID}`);
        const chatHistory = response.data.chats;
        
        if (chatHistory.length > 0) {
          const convertedSessions = chatHistory.map((chat: any) => ({
            id: chat.message_id,
            title: 'Chat Session',
            lastMessage: chat.question,
            timestamp: new Date(chat.timestamp).getTime(),
            messages: [
              {
                id: `${chat.message_id}-q`,
                content: chat.question,
                sender: 'user' as const,
                timestamp: new Date(chat.timestamp).getTime(),
              },
              {
                id: `${chat.message_id}-a`,
                content: chat.answer,
                sender: 'bot' as const,
                timestamp: new Date(chat.timestamp).getTime() + 1000,
              },
            ],
          }));

          setSessions(convertedSessions);
          setCurrentSession(convertedSessions[0]);
        } else {
          createDefaultSession();
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        createDefaultSession();
      }
    };

    loadChatHistory();
  }, []);

  const createDefaultSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: Date.now(),
      messages: [],
    };

    setSessions([newSession]);
    setCurrentSession(newSession);
  }, []);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: Date.now(),
      messages: [],
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    setCurrentSession(newSession);
  }, [sessions]);

  const selectCurrentSession = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
      }
    },
    [sessions]
  );

  const sendMessage = useCallback(
    async (content: string, attachments?: { name: string; type: string; uri: string }[]) => {
      if (!currentSession || !content.trim()) return;

      setIsLoading(true);

      try {
        // Create user message
        const userMessage: Message = {
          id: Date.now().toString(),
          content,
          sender: 'user',
          timestamp: Date.now(),
          attachments,
        };

        // Update UI with user message
        const updatedSession = {
          ...currentSession,
          lastMessage: content,
          timestamp: Date.now(),
          messages: [...currentSession.messages, userMessage],
        };

        const updatedSessions = sessions.map((s) =>
          s.id === currentSession.id ? updatedSession : s
        );

        setSessions(updatedSessions);
        setCurrentSession(updatedSession);

        // Handle file uploads if present
        if (attachments && attachments.length > 0) {
          for (const file of attachments) {
            const formData = new FormData();
            formData.append('user_id', DEFAULT_USER_ID);
            formData.append('file', {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as any);

            await axios.post(`${API_URL}/chat/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
          }
        }

        // Send message to backend
        const response = await axios.post(`${API_URL}/chat/send`, {
          user_id: DEFAULT_USER_ID,
          message: content,
          metadata: {
            language: 'en',
          },
        });

        // Create bot response message
        const botMessage: Message = {
          id: response.data.message_id,
          content: response.data.response,
          sender: 'bot',
          timestamp: new Date(response.data.timestamp).getTime(),
        };

        // Update UI with bot response
        const finalUpdatedSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, botMessage],
        };

        const finalUpdatedSessions = updatedSessions.map((s) =>
          s.id === currentSession.id ? finalUpdatedSession : s
        );

        setSessions(finalUpdatedSessions);
        setCurrentSession(finalUpdatedSession);
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Show error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, there was an error connecting to the server. Please try again later.",
          sender: 'bot',
          timestamp: Date.now(),
        };

        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            messages: [...currentSession.messages, errorMessage],
          };

          const updatedSessions = sessions.map((s) =>
            s.id === currentSession.id ? updatedSession : s
          );

          setSessions(updatedSessions);
          setCurrentSession(updatedSession);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession, sessions]
  );

  const clearHistory = useCallback(async () => {
    setSessions([]);
    setCurrentSession(null);
    createDefaultSession();
  }, [createDefaultSession]);

  const deleteSession = useCallback(
    async (sessionId: string) => {
      const updatedSessions = sessions.filter((s) => s.id !== sessionId);
      setSessions(updatedSessions);
      
      if (currentSession?.id === sessionId) {
        if (updatedSessions.length > 0) {
          setCurrentSession(updatedSessions[0]);
        } else {
          setCurrentSession(null);
          createDefaultSession();
        }
      }
    },
    [sessions, currentSession, createDefaultSession]
  );

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        createNewSession,
        setCurrentSession: selectCurrentSession,
        sendMessage,
        clearHistory,
        deleteSession,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};