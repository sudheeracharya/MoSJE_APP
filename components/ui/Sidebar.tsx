import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import {
  CirclePlus as PlusCircle,
  User,
  ListTodo,
  Trash2,
  SunMoon,
  LogOut,
  X,
} from 'lucide-react-native';
import ToggleSwitch from './ToggleSwitch';
import axios from 'axios';

type SidebarProps = {
  onClose: () => void;
};

const API_URL = 'http://127.0.0.1:8000';
const DEFAULT_USER_ID = 'user123';

export default function Sidebar({ onClose }: SidebarProps) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { createNewSession, clearHistory, sessions } = useChat();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/user/profile/${DEFAULT_USER_ID}`
      );
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleCreateNewChat = () => {
    createNewSession();
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          MoSJE APP
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {userProfile && (
          <View
            style={[
              styles.profileSection,
              { borderBottomColor: colors.border },
            ]}
          >
            <User size={40} color={colors.primary} />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {userProfile.name}
              </Text>
              <Text
                style={[
                  styles.profileLanguage,
                  { color: colors.textSecondary },
                ]}
              >
                Language: {userProfile.language.toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={handleCreateNewChat}>
          <PlusCircle size={20} color="#4CAF50" />
          <Text style={[styles.menuItemText, { color: '#4CAF50' }]}>
            New Chat
          </Text>
        </TouchableOpacity>

        <View style={styles.chatHistorySection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Chat History
          </Text>
          {sessions.map((session, index) => (
            <TouchableOpacity
              key={session.id}
              style={[styles.historyItem, { borderBottomColor: colors.border }]}
            >
              <ListTodo size={16} color={colors.text} />
              <Text
                style={[styles.historyText, { color: colors.text }]}
                numberOfLines={1}
              >
                {session.lastMessage || `Chat ${index + 1}`}
              </Text>
              <Text
                style={[styles.historyTime, { color: colors.textSecondary }]}
              >
                {new Date(session.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            clearHistory();
            onClose();
          }}
        >
          <Trash2 size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            Clear History
          </Text>
        </TouchableOpacity>

        <View style={styles.menuItem}>
          <SunMoon size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            Dark Mode
          </Text>
          <View style={styles.spacer} />
          <ToggleSwitch value={isDarkMode} onToggle={toggleTheme} />
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <LogOut size={20} color="#F44336" />
          <Text style={[styles.menuItemText, { color: '#F44336' }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          MOSJE APP v1.0
        </Text>
      </View>
    </View>
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
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  profileInfo: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  profileLanguage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    fontFamily: 'Inter-Regular',
  },
  chatHistorySection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  historyTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});
