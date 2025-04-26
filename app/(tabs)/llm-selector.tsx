import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Brain, ChevronDown, ChevronUp, Check } from 'lucide-react-native';

const LLM_OPTIONS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable GPT model' },
  { id: 'gpt-3.5', name: 'GPT-3.5', description: 'Faster, cost-effective GPT' },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: "Google's advanced LLM",
  },
  { id: 'claude-2', name: 'Claude 2', description: "Anthropic's latest model" },
  { id: 'llama-2', name: 'LLaMA 2', description: "Meta's open source LLM" },
];

export default function LLMSelector() {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState(LLM_OPTIONS[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLLM = (llm: (typeof LLM_OPTIONS)[0]) => {
    setSelectedLLM(llm);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Brain size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Select LLM
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.dropdown, { backgroundColor: colors.surface }]}
          onPress={toggleDropdown}
          activeOpacity={0.7}
        >
          <View style={styles.selectedOption}>
            <Text style={[styles.selectedText, { color: colors.text }]}>
              {selectedLLM.name}
            </Text>
            {isOpen ? (
              <ChevronUp size={20} color={colors.text} />
            ) : (
              <ChevronDown size={20} color={colors.text} />
            )}
          </View>
        </TouchableOpacity>

        {isOpen && (
          <ScrollView
            style={[styles.optionsList, { backgroundColor: colors.surface }]}
            showsVerticalScrollIndicator={false}
          >
            {LLM_OPTIONS.map((llm) => (
              <TouchableOpacity
                key={llm.id}
                style={[
                  styles.option,
                  selectedLLM.id === llm.id && {
                    backgroundColor: colors.primary + '20',
                  },
                ]}
                onPress={() => selectLLM(llm)}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>
                      {llm.name}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {llm.description}
                    </Text>
                  </View>
                  {selectedLLM.id === llm.id && (
                    <Check size={20} color={colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            Current Model: {selectedLLM.name}
          </Text>
          <Text
            style={[styles.infoDescription, { color: colors.textSecondary }]}
          >
            This model will be used for all your chat interactions. You can
            change it anytime.
          </Text>
        </View>
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
    padding: 16,
  },
  dropdown: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  optionsList: {
    maxHeight: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  option: {
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});
