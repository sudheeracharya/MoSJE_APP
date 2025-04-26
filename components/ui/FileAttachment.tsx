import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { File, FileImage, FilePen as FilePdf, FileText } from 'lucide-react-native';

type FileProps = {
  file: {
    name: string;
    type: string;
    uri: string;
  };
};

export default function FileAttachment({ file }: FileProps) {
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
    if (file.name.length > 20) {
      return file.name.substring(0, 17) + '...';
    }
    return file.name;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.iconContainer}>
        {getFileIcon()}
      </View>
      <View style={styles.fileInfo}>
        <Text style={[styles.fileName, { color: colors.text }]}>
          {getFileNameDisplay()}
        </Text>
        <Text style={[styles.fileType, { color: colors.textSecondary }]}>
          {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  fileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  fileType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});