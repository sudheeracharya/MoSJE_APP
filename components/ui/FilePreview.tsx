import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { X, File, FileImage, FilePen as FilePdf, FileText } from 'lucide-react-native';

type FilePreviewProps = {
  file: {
    name: string;
    type: string;
    uri: string;
  };
  onRemove: () => void;
};

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const { colors } = useTheme();
  
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return (
        <Image
          source={{ uri: file.uri }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      );
    } else if (file.type === 'application/pdf') {
      return <FilePdf size={24} color={colors.error} />;
    } else if (file.type.startsWith('text/')) {
      return <FileText size={24} color={colors.primary} />;
    } else {
      return <File size={24} color={colors.textSecondary} />;
    }
  };

  const getFileNameDisplay = () => {
    if (file.name.length > 15) {
      return file.name.substring(0, 12) + '...';
    }
    return file.name;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getFileIcon()}
        </View>
        <Text style={[styles.fileName, { color: colors.text }]}>
          {getFileNameDisplay()}
        </Text>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <X size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 8,
    marginRight: 8,
    width: 130,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  fileName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});