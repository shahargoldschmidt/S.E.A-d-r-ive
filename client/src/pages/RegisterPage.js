/* client/src/pages/RegisterPage.js */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { registerUser } from '../services/api'; 
import AppWrapper from '../components/AppWrapper';
import PasswordCriteria from '../components/PasswordCriteria';
import { theme } from '../styles/theme';
import { getAuthStyles } from '../styles/authStyles';
import ImagePickerSheet from '../components/ImagePickerSheet';

const RegisterPage = ({ isDarkMode, toggleTheme, navigation }) => {
    const { width, height } = useWindowDimensions();
    const styles = getAuthStyles(width, height);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', image: '' });
    const [passwordCriteria, setPasswordCriteria] = useState({ length: false, upper: false, lower: false, number: false, special: false });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(false); 
    const [error, setError] = useState('');

    const getInitial = () => (!formData.name.trim() ? '👤' : formData.name.trim().charAt(0).toUpperCase());

    const getGlowStyle = () => {
        if (!formData.confirmPassword) return styles.seaInput;
        const isMatch = formData.password === formData.confirmPassword;
        return [styles.seaInput, {
            borderColor: isMatch ? '#4CAF50' : '#FF5252',
            borderWidth: 2,
            shadowColor: isMatch ? '#4CAF50' : '#FF5252',
            shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 
        }];
    };

    const openPicker = () => {
        setIsSheetVisible(true);
    };

    const handleImageResult = (base64Image) => {
        setFormData({ ...formData, image: base64Image });
    };

    const handlePasswordChange = (val) => {
        setFormData({ ...formData, password: val });
        setPasswordCriteria({
            length: val.length >= 8,
            upper: /[A-Z]/.test(val),
            lower: /[a-z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
        });
    };

    const handleRegister = async () => {
        // Validation Hierarchy
        setError('');

        // 1. Mandatory Fields Check
        if (!formData.name || !formData.email || !formData.password) {
            setError("Please fill in all mandatory fields.");
            return;
        }

        // 2. Email Format Validation (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // 3. Password Strength Validation (All criteria must be true)
        const isStrong = Object.values(passwordCriteria).every(Boolean);
        if (!isStrong) {
            setError("Weak password! Please meet all security requirements.");
            return;
        }

        // 4. Password Confirmation Check
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            await registerUser(formData);
            navigation.navigate('Login');
        } catch (err) {
            setError(err.message || "Registration failed");
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
                        <Text style={[styles.appTitle, { color: isDarkMode ? '#fff' : theme.colors.deepNavy }]}>JOIN THE CREW</Text>
                        <Text style={styles.subtitle}>Create your secure profile</Text>

                        <View style={styles.imageUploadContainer}>
                           <TouchableOpacity onPress={openPicker} style={styles.imageCircle}>
                    {formData.image ? (
                        <Image source={{ uri: formData.image }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <Text style={styles.initialsText}>{getInitial()}</Text>
                    )}
                </TouchableOpacity>
                            {formData.image && (
                                <TouchableOpacity style={styles.removeImageBtn} onPress={() => setFormData({ ...formData, image: '' })}>
                                    <Feather name="x" size={16} color="#fff" />
                                </TouchableOpacity>
                            )}
                            <Text style={{ fontSize: 12, marginTop: 8, color: theme.colors.oceanBlue, fontWeight: '600' }}>
                                {formData.image ? "Replace photo" : "Click to add photo"}
                            </Text>
                        </View>

                        {error ? <Text style={{ color: theme.colors.error, marginBottom: 12, textAlign: 'center' }}>{error}</Text> : null}

                        <TextInput style={styles.seaInput} placeholder="Full Name" placeholderTextColor="#888" onChangeText={(v) => setFormData({ ...formData, name: v })} />
                        <View style={{ height: 10 }} />
                        <TextInput style={styles.seaInput} placeholder="Email Address" autoCapitalize="none" placeholderTextColor="#888" onChangeText={(v) => setFormData({ ...formData, email: v })} />
                        <View style={{ height: 10 }} />

                        <View style={styles.inputWrapper}>
                            <TextInput style={styles.seaInput} placeholder="Password" secureTextEntry={!showPass} onChangeText={handlePasswordChange} placeholderTextColor="#888" />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPass(!showPass)}>
                                <Feather name={showPass ? "eye" : "eye-off"} size={18} color="#888" />
                            </TouchableOpacity>
                        </View>

                        {formData.password.length > 0 && <PasswordCriteria criteria={passwordCriteria} />}

                        <View style={styles.inputWrapper}>
                            <TextInput style={getGlowStyle()} placeholder="Confirm Password" secureTextEntry={!showConfirm} onChangeText={(v) => setFormData({ ...formData, confirmPassword: v })} placeholderTextColor="#888" />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirm(!showConfirm)}>
                                <Feather name={showConfirm ? "eye" : "eye-off"} size={18} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister} disabled={isLoading} activeOpacity={0.8}>
                            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 15 }}>
                            <Text style={{ color: isDarkMode ? '#fff' : '#444' }}>
                                Already have an account? <Text style={{ color: theme.colors.oceanBlue, fontWeight: 'bold' }}>Log In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <ImagePickerSheet 
                isVisible={isSheetVisible}
                onClose={() => setIsSheetVisible(false)}
                onImagePicked={handleImageResult}
                isDarkMode={isDarkMode}
            />
        </AppWrapper>
    );
};

export default RegisterPage;