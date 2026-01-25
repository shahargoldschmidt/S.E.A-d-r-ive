import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

const AppWrapper = ({ children, isDarkMode }) => {
    const waveAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(waveAnim, {
                toValue: -theme.safeSizes.width,
                duration: 12000,
                useNativeDriver: true, // חובה ערך בוליאני ללא מירכאות
            })
        ).start();
    }, []);

    const bgColor = isDarkMode ? theme.colors.darkBg : theme.colors.lightBg;

    return (
        <SafeAreaProvider>
            <View style={[styles.container, { backgroundColor: bgColor }]}>
                <StatusBar 
                    barStyle="light-content" 
                    translucent={true} // תיקון: שימוש בערך בוליאני מפורש
                    backgroundColor="transparent" 
                />
                <Animated.View style={[styles.waveContainer, { transform: [{ translateX: waveAnim }] }]}>
                    <View style={{ flexDirection: 'row' }}>
                        {[1, 2, 3].map((i) => (
                            <View key={i} style={styles.waveGraphic} />
                        ))}
                    </View>
                </Animated.View>
                <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, overflow: 'hidden' },
    waveContainer: { position: 'absolute', bottom: 0, width: theme.safeSizes.width * 3, height: 200, opacity: 0.1 },
    waveGraphic: { width: theme.safeSizes.width, height: 200, backgroundColor: '#ffffff', borderTopLeftRadius: 200, borderTopRightRadius: 200, transform: [{ scaleX: 1.5 }] }
});

export default AppWrapper;