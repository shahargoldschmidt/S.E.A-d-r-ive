/* client/src/styles/modalStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const getModalStyles = (width, height, isDarkMode) => {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 20, 40, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        // Main card container for the folder popup
        modalCard: {
            width: '85%',
            maxWidth: 450,
            padding: 30,
            borderRadius: 24,
            backgroundColor: isDarkMode ? theme.colors.darkCard : theme.colors.creamCard,
            elevation: 20,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 15,
        },
        // Specialized styling for the full-screen File creation view
        fullViewContainer: {
            flex: 1,
            backgroundColor: isDarkMode ? theme.colors.darkBg : theme.colors.lightBg,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            paddingTop: theme.safeSizes.statusBar + 10,
        },
        title: {
            fontSize: 22,
            fontWeight: '800',
            color: '#0ea5e9', 
            marginBottom: 20,
            textAlign: 'center',
        },
        label: {
            fontSize: 13,
            fontWeight: '600',
            color: isDarkMode ? '#94a3b8' : '#64748b',
            marginBottom: 8,
            marginLeft: 5,
        },
        errorText: {
            color: theme.colors.error,
            fontSize: 13,
            textAlign: 'center',
            marginBottom: 15,
            fontWeight: '600',
        }
    });
};