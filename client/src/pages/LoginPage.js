/* client/src/pages/LoginPage.js */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppWrapper from '../components/AppWrapper';
import { theme } from '../styles/theme';
import { getAuthStyles } from '../styles/authStyles';
import AppLogo from '../assets/Logo.png'; 

const LoginPage = ({ isDarkMode, toggleTheme, navigation }) => {
    // Dynamically retrieve dimensions to handle orientation flipping
    const { width, height } = useWindowDimensions();
    const styles = getAuthStyles(width, height);
    const [showPass, setShowPass] = useState(false);

    return (
        <AppWrapper isDarkMode={isDarkMode}>
            <TouchableOpacity style={styles.themeToggleBtn} onPress={toggleTheme}>
                <Feather name={isDarkMode ? "sun" : "moon"} size={22} color="#fff" />
            </TouchableOpacity>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <View style={[styles.glassCard, { backgroundColor: isDarkMode ? theme.colors.darkCard : theme.colors.creamCard }]}>
                        {/* Scalable Branding Section */}
                        <Image source={AppLogo} style={styles.logo} resizeMode="contain" />
                        <Text style={[styles.appTitle, { color: isDarkMode ? '#fff' : theme.colors.deepNavy }]}>S.E.A. D(R)IVE</Text>
                        <Text style={styles.subtitle}>Sail to Success</Text>

                        <TextInput 
                            style={styles.seaInput} 
                            placeholder="Email Address" 
                            autoCapitalize="none" 
                            placeholderTextColor="#888" 
                        />
                        <View style={{ height: 10 }} />
                        
                        {/* Password Field with Visibility Toggle */}
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.seaInput} 
                                placeholder="Password" 
                                secureTextEntry={!showPass} 
                                placeholderTextColor="#888"
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPass(!showPass)}>
                                <Feather name={showPass ? "eye" : "eye-off"} size={18} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
                            <Text style={styles.btnText}>Dive In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
                            <Text style={{ color: isDarkMode ? '#fff' : '#444' }}>
                                Don't have an account? <Text style={{ color: theme.colors.oceanBlue, fontWeight: 'bold' }}>Register</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppWrapper>
    );
};

export default LoginPage;