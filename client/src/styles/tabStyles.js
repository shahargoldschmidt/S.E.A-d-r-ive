/* client/src/styles/tabStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const getTabStyles = (width, isDarkMode) => {
    const colors = theme.colors;

    return StyleSheet.create({
        tabBarContainer: {
            flexDirection: 'row',
            height: 70,
            backgroundColor: isDarkMode ? colors.darkCard : '#fff',
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 10,
        },
        tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
        tabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
        
        // --- Central Floating Action Button (FAB) ---
        fabWrapper: {
            position: 'absolute',
            top: -30, // Elevated above the bar
            left: (width / 2) - 30,
            zIndex: 2000,
        },
        fabButton: {
            width: 60, height: 60,
            borderRadius: 30, // Perfectly circular
            justifyContent: 'center', alignItems: 'center',
            backgroundColor: isDarkMode ? '#000' : colors.oceanBlue,
            elevation: 8, shadowOpacity: 0.4, shadowRadius: 8,
            shadowColor: isDarkMode ? '#fff' : colors.oceanBlue, // Glow effect in dark mode
            borderWidth: isDarkMode ? 1.5 : 0,
            borderColor: isDarkMode ? '#fff' : 'transparent',
        },
        
        // --- Action Tab (Bottom Sheet) ---
        actionModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
        actionSheet: {
            padding: 25,
            borderTopLeftRadius: 35, borderTopRightRadius: 35,
            minHeight: 300,
        },
        sheetHandle: {
            width: 40, height: 5, 
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : '#ccc', 
            borderRadius: 3, alignSelf: 'center', marginBottom: 20 
        },
        actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 10 },
        actionItem: { width: '40%', alignItems: 'center', marginBottom: 25 }
    });
};