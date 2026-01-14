/* client/src/pages/LoginPage.js */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { loginUser } from '../services/api'; // API Connection
import AppWrapper from '../components/AppWrapper';
import { theme } from '../styles/theme';
import { getAuthStyles } from '../styles/authStyles';
import AppLogo from '../assets/Logo.png'; 

const LoginPage = ({ isDarkMode, toggleTheme, navigation }) => {
    const { width, height } = useWindowDimensions();
    const styles = getAuthStyles(width, height);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    
    // API States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Handles the login process via API.
     */
    const handleLogin = async () => {
        if (!email || !password) {
            setError("All fields are mandatory!");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Attempt to login
            await loginUser(email, password);
            navigation.replace('Dashboard'); // Navigate on success
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppWrapper isDarkMode={isDarkMode}>
            <TouchableOpacity style={styles.themeToggleBtn} onPress={toggleTheme}>
                <Feather name={isDarkMode ? "sun" : "moon"} size={22} color="#fff" />
            </TouchableOpacity>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <View style={[styles.glassCard, { backgroundColor: isDarkMode ? theme.colors.darkCard : theme.colors.creamCard }]}>
                        <Image source={AppLogo} style={styles.logo} resizeMode="contain" />
                        <Text style={[styles.appTitle, { color: isDarkMode ? '#fff' : theme.colors.deepNavy }]}>S.E.A. D(R)IVE</Text>
                        <Text style={styles.subtitle}>Sail to Success</Text>

                        {/* Error Display */}
                        {error ? <Text style={{ color: theme.colors.error, marginBottom: 10, textAlign: 'center' }}>{error}</Text> : null}

                        <TextInput 
                            style={styles.seaInput} 
                            placeholder="Email Address" 
                            autoCapitalize="none" 
                            placeholderTextColor="#888" 
                            onChangeText={setEmail}
                        />
                        <View style={{ height: 10 }} />
                        
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.seaInput} 
                                placeholder="Password" 
                                secureTextEntry={!showPass} 
                                placeholderTextColor="#888"
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPass(!showPass)}>
                                <Feather name={showPass ? "eye" : "eye-off"} size={18} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.btnPrimary} 
                            onPress={handleLogin} 
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Dive In</Text>}
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