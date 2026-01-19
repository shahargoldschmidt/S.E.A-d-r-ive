/* client/src/styles/fileListStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme'; // Using global theme

export const getFileListStyles = (width, height, isDarkMode) => {
    const isLandscape = width > height;
    const colors = theme.colors;

    return StyleSheet.create({
        listContainer: {
            flex: 1,
            // --- Orientation Adjustment: More breathing room in landscape ---
            paddingHorizontal: isLandscape ? 40 : 20,
            paddingTop: 10,
        },
        fileRow: {
            flexDirection: 'row',
            alignItems: 'center',
            // --- Landscape adjustment: Tighter rows when horizontal ---
            paddingVertical: isLandscape ? 8 : 14,
            paddingHorizontal: 15,
            borderRadius: 22,
            // Using theme colors for consistency
            backgroundColor: isDarkMode ? colors.darkCard : '#fff',
            marginBottom: 12,
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
        },
        iconWrapper: {
            width: isLandscape ? 42 : 52,
            height: isLandscape ? 42 : 52,
            borderRadius: 16,
            // Ocean Blue accent from your theme
            backgroundColor: isDarkMode ? 'rgba(0, 172, 193, 0.15)' : 'rgba(0, 172, 193, 0.08)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        fileName: {
            fontSize: isLandscape ? 15 : 17,
            fontWeight: '700',
            color: isDarkMode ? '#fff' : colors.textDark,
        },
        fileMeta: {
            fontSize: 12,
            color: isDarkMode ? '#94a3b8' : '#64748b',
            marginTop: 2,
        }
    });
};