/* client/src/styles/actionStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme';


export const getActionStyles = (width, height, isDarkMode) => {
    const isLandscape = width > height;
    const colors = theme.colors;

    return StyleSheet.create({
        // Bottom Sheet container
        sheetOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        sheetContent: {
            backgroundColor: isDarkMode ? theme.colors.darkCard : '#fff',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingBottom: 40,
            paddingTop: 10,
            width: isLandscape ? '60%' : '100%', // Don't span full width in landscape
            alignSelf: 'center', // Center the sheet if not full width
            maxHeight: isLandscape ? '70%' : 'auto', // Ensure scrolling on short screens
        },
        // Visual handle at the top of the sheet
        sheetHandle: {
            width: 40,
            height: 5,
            backgroundColor: isDarkMode ? '#444' : '#ccc',
            borderRadius: 3,
            alignSelf: 'center',
            marginBottom: 15,
        },
        actionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            paddingHorizontal: 20,
            gap: 15,
        },
        actionText: {
            fontSize: 16,
            fontWeight: '500',
            color: isDarkMode ? '#fff' : '#333',
        },
        dangerText: {
            color: theme.colors.error,
        },
        // Style for folder list in Move modal
        folderList: {
            maxHeight: isLandscape ? 150 : 300, 
            // ---------------------------
            marginTop: 10,
        },
        folderItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            borderRadius: 12,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
            marginBottom: 8,
            gap: 12,
        }
    });
};