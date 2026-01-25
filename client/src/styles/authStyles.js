/* client/src/styles/authStyles.js */
import { StyleSheet } from 'react-native';
import { theme } from './theme';

/**
 * Generates dynamic styles optimized for both Portrait and Landscape orientations.
 * @param {number} width - Screen width from useWindowDimensions.
 * @param {number} height - Screen height from useWindowDimensions.
 */
export const getAuthStyles = (width, height) => {
    const isLandscape = width > height;
    
    return StyleSheet.create({
        contentContainer: { 
            flexGrow: 1, 
            paddingHorizontal: 20,
            // Adjust top padding based on device status bar and orientation
            paddingTop: isLandscape ? 15 : theme.safeSizes.statusBar + 25,
            paddingBottom: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },
        themeToggleBtn: {
            position: 'absolute', 
            top: theme.safeSizes.statusBar + 5, 
            right: 20, 
            width: 42, height: 42, borderRadius: 21, 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000,
        },
        glassCard: {
            width: '100%', 
            maxWidth: isLandscape ? 550 : 420,
            padding: isLandscape ? 15 : 25, 
            borderRadius: 30, 
            alignItems: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.15, shadowRadius: 10,
        },
        logo: { 
            // Scale logo down in landscape to maintain visibility of inputs
            width: isLandscape ? 100 : 160, 
            height: isLandscape ? 80 : 120, 
            marginBottom: isLandscape ? 5 : 15 
        },
        appTitle: { 
            fontSize: isLandscape ? 18 : 22, 
            fontWeight: '800', 
            letterSpacing: 1.2, 
            textTransform: 'uppercase',
            marginBottom: 2
        },
        subtitle: { 
            fontStyle: 'italic', fontSize: 13, color: theme.colors.oceanBlue, marginBottom: 15 
        },
        // --- Profile Image Upload Section ---
        imageUploadContainer: {
            position: 'relative',
            marginBottom: 20,
            alignItems: 'center',
        },
        imageCircle: {
            width: isLandscape ? 85 : 115, 
            height: isLandscape ? 85 : 115, 
            borderRadius: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 3, 
            borderColor: theme.colors.oceanBlue,
            justifyContent: 'center', alignItems: 'center',
            overflow: 'hidden',
        },
        initialsText: {
            fontSize: isLandscape ? 34 : 46,
            fontWeight: 'bold',
            color: theme.colors.oceanBlue,
        },
        removeImageBtn: {
            position: 'absolute',
            top: 0, right: 0,
            backgroundColor: theme.colors.oceanBlue,
            width: 30, height: 30, borderRadius: 15,
            justifyContent: 'center', alignItems: 'center',
            borderWidth: 2, borderColor: '#fff',
            zIndex: 10,
        },
        // --- Form Field Styling ---
        inputWrapper: {
            width: '100%',
            position: 'relative',
            justifyContent: 'center',
            marginBottom: 10,
        },
        seaInput: {
            width: '100%', height: 48, borderRadius: 24, paddingHorizontal: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            fontSize: 15, borderWidth: 1, borderColor: '#eee',
        },
        eyeIcon: {
            position: 'absolute',
            right: 15,
            padding: 5,
        },
        btnPrimary: {
            width: '100%', height: 50, backgroundColor: theme.colors.oceanBlue, 
            borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10,
        },
        btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    });
};