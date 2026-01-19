/* client/src/styles/modalStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const getModalStyles = (width, height, isDarkMode) => {
    const isLandscape = width > height;

    return StyleSheet.create({
        // Background overlay for the folder popup
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 20, 40, 0.75)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        // Card style for the Folder Modal & Popups
        modalCard: {
            width: isLandscape ? '60%' : '85%', // Narrower in landscape so it doesn't stretch too much
            maxWidth: 450,
            maxHeight: isLandscape ? '85%' : 'auto', // Prevent overflowing vertical screen space
            alignSelf: 'center', // Keep centered when width changes
            // ---------------------------
            padding: 30,
            borderRadius: 24,
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            elevation: 20,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 15,
        },
        // Header styling for the full-screen File Tab
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            // Less top padding in landscape as status bar is often smaller or to the side
            paddingTop: isLandscape ? 20 : 50, 
            // ---------------------------
            backgroundColor: isDarkMode ? 'rgba(15, 32, 39, 0.9)' : theme.colors.oceanBlue,
        },
        headerTitle: {
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 15,
        },
        // Reusable input labels
        label: {
            fontSize: 13,
            fontWeight: '600',
            color: isDarkMode ? '#94a3b8' : '#64748b',
            marginBottom: 8,
            marginLeft: 5,
        },
        errorText: {
            color: '#ef4444',
            fontSize: 13,
            textAlign: 'center',
            marginBottom: 15,
            fontWeight: '700',
        }
    });
};