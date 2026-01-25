/* client/src/styles/editorStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const getEditorStyles = (width, height, isDarkMode) => {
    const isLandscape = width > height;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? theme.colors.darkBg : theme.colors.lightBg,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: isLandscape ? 10 : 20,
            paddingTop: isLandscape ? 10 : theme.safeSizes.statusBar + 10,
            backgroundColor: isDarkMode ? 'rgba(15, 32, 39, 0.9)' : theme.colors.oceanBlue,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        titleContainer: {
            marginLeft: 12,
            flex: 1,
        },
        fileTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
        },
        titleInput: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.5)',
            paddingVertical: 2,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        // Main Content Area
        contentCard: {
            flex: 1,
            margin: 15,
            borderRadius: 25,
            backgroundColor: isDarkMode ? theme.colors.darkCard : '#fff',
            elevation: 5,
            overflow: 'hidden',
        },
        textInput: {
            flex: 1,
            padding: 20,
            fontSize: 16,
            color: isDarkMode ? '#f1f5f9' : '#334155',
            textAlignVertical: 'top', // Crucial for Android multiline
        },
        imageContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#000' : '#f8fafc',
        },
        fullImage: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
        },
        // Floating toolbar for text actions
        toolbar: {
            flexDirection: 'row',
            padding: 10,
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : '#f1f5f9',
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.05)',
            justifyContent: 'center',
            gap: 15,
        }
    });
};