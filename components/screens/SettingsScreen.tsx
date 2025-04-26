import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { User, Settings, LogOut, Bell, Lock, CircleHelp as HelpCircle, Info, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors } = useTheme();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', route: 'profile' },
        { icon: Bell, label: 'Notifications', route: 'notifications' },
        { icon: Lock, label: 'Privacy & Security', route: 'privacy' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', route: 'help' },
        { icon: Info, label: 'About', route: 'about' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Settings size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>
      <ScrollView style={styles.content}>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              {section.title}
            </Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[styles.settingItem, { backgroundColor: colors.surface }]}
              >
                <View style={styles.settingItemLeft}>
                  <item.icon size={20} color={colors.text} style={styles.settingIcon} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]}>
          <LogOut size={20} color={colors.error} style={styles.settingIcon} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            MOSJE APP v1.0
          </Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 32,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});