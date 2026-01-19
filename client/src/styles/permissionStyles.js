/* client/src/styles/permissionStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const getPermissionStyles = (width, height, isDarkMode) => {
    const isLandscape = width > height;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? theme.colors.darkBg : theme.colors.lightBg,
        },
        // Header with file info
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: isLandscape ? 15 : 20,
            paddingTop: isLandscape ? 15 : theme.safeSizes.statusBar + 10,
            // ---------------------------
            backgroundColor: isDarkMode ? 'rgba(15, 32, 39, 0.9)' : theme.colors.oceanBlue,
        },
        headerTitle: {
            color: '#fff',
            fontSize: isLandscape ? 16 : 18,
            // ---------------------------
            fontWeight: 'bold',
            marginLeft: 12,
            flex: 1,
        },
        // Add Collaborator Section
        inputSection: {
            padding: isLandscape ? 15 : 20,
            flexDirection: isLandscape ? 'row' : 'column',
            alignItems: isLandscape ? 'center' : 'stretch',
            gap: isLandscape ? 20 : 0,
            // ---------------------------
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        },
        roleSelector: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: isLandscape ? 0 : 15,
            flex: isLandscape ? 1 : 0, 
            gap: 10,
        },
        roleButton: {
            flex: 1,
            paddingVertical: isLandscape ? 6 : 8,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: 'center',
            borderColor: theme.colors.oceanBlue,
        },
        roleButtonActive: {
            backgroundColor: theme.colors.oceanBlue,
        },
        roleButtonText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: theme.colors.oceanBlue,
        },
        // Collaborator List Rows
        collabRow: {
            flexDirection: 'row',
            alignItems: 'center',
            // --- Orientation Adjustment: More compact rows in landscape ---
            padding: isLandscape ? 10 : 15,
            // ---------------------------
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
        },
        avatarSmall: {
            // --- Orientation Adjustment: Slightly smaller icons in landscape ---
            width: isLandscape ? 34 : 40,
            height: isLandscape ? 34 : 40,
            // ---------------------------
            borderRadius: 20,
            backgroundColor: theme.colors.oceanBlue,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        avatarText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        collabInfo: {
            flex: 1,
        },
        collabEmail: {
            fontSize: isLandscape ? 13 : 14,
            fontWeight: '600',
            color: isDarkMode ? '#fff' : '#334155',
        },
        roleBadge: {
            fontSize: 11,
            fontWeight: 'bold',
            color: '#888',
            marginTop: 2,
        }
    });
};