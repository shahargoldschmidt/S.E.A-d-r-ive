import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
    colors: {
        oceanBlue: '#00acc1',
        oceanBlueHover: '#0097e6',
        deepNavy: '#052e4a',
        lightBg: '#3a7bd5',
        darkBg: '#0f2027',
        creamCard: 'rgba(253, 250, 240, 0.95)',
        darkCard: 'rgba(15, 32, 39, 0.8)',
        textLight: '#ffffff',
        textDark: '#374151',
        error: '#ff5252',
    },
    safeSizes: {
        width,
        height,
        statusBar: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
        borderRadius: 50,
    }
};