// import { Tabs } from 'expo-router';
// import { useTheme } from '@/context/ThemeContext';
// import { MessageCircle, Settings } from 'lucide-react-native';

// export default function TabLayout() {
//   const { isDarkMode, colors } = useTheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: colors.textSecondary,
//         tabBarStyle: {
//           backgroundColor: colors.background,
//           borderTopColor: colors.border,
//         },
//         tabBarLabelStyle: {
//           fontFamily: 'Inter-Medium',
//         },
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ color, size }) => (
//             <MessageCircle size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: 'Settings',
//           tabBarIcon: ({ color, size }) => (
//             <Settings size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

//Choose LLMs sections added
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { MessageCircle, Brain, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="llm-selector"
        options={{
          title: 'LLMs',
          tabBarIcon: ({ color, size }) => <Brain size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
