/* client/src/styles/navbarStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const getNavbarStyles = (width, height, isDarkMode) => {
    const isLandscape = width > height;
    const colors = theme.colors;

    return StyleSheet.create({
        navContainer: {
            height: 70,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            justifyContent: 'space-between',
            backgroundColor: isDarkMode ? colors.darkCard : colors.creamCard,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            zIndex: 1000,
        },
        middleSection: { flex: 1, marginHorizontal: 10, position: 'relative' },
        searchWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff',
            borderRadius: 25,
            paddingHorizontal: 15,
            height: 44,
            borderWidth: 1,
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        },
        searchInput: { flex: 1, fontSize: 16, color: isDarkMode ? '#fff' : colors.textDark, paddingVertical: 0 },
        
        // --- Search Results Aesthetic Dropdown ---
        searchDropdown: {
            position: 'absolute',
            top: 52, left: 0, right: 0,
            backgroundColor: isDarkMode ? '#1e293b' : '#fff',
            borderRadius: 18,
            paddingVertical: 10,
            elevation: 15, // Android shadow
            shadowColor: '#000', // iOS shadow
            shadowOpacity: 0.3, shadowRadius: 15,
            maxHeight: 380,
        },
        searchResultItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
        },
        resultIconWrapper: { marginRight: 15 },
        resultName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
        resultMeta: { fontSize: 11, color: '#888', fontWeight: '400' },
        resultSize: { fontSize: 12, color: colors.oceanBlue, fontWeight: '800' },
        searchStatusText: { padding: 25, textAlign: 'center', color: '#888', fontSize: 15, fontStyle: 'italic' },

        // --- Layout Sections ---
        leftSection: { flexDirection: 'row', alignItems: 'center' },
        rightSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        avatarBtn: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden', borderWidth: 2, borderColor: colors.oceanBlue },
        avatarImg: { width: '100%', height: '100%' },
        avatarInitial: { width: '100%', height: '100%', backgroundColor: colors.oceanBlue, justifyContent: 'center', alignItems: 'center' },
    });
};