/* client/src/pages/RegisterPage.js */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import AppWrapper from '../components/AppWrapper';
import PasswordCriteria from '../components/PasswordCriteria';
import { theme } from '../styles/theme';
import { getAuthStyles } from '../styles/authStyles';

const RegisterPage = ({ isDarkMode, toggleTheme, navigation }) => {
    const { width, height } = useWindowDimensions();
    const styles = getAuthStyles(width, height);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', image: '' });
    const [passwordCriteria, setPasswordCriteria] = useState({ length: false, upper: false, lower: false, number: false, special: false });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Logic to display first letter of name if no image is uploaded
    const getInitial = () => {
        if (!formData.name.trim()) return '👤';
        return formData.name.trim().charAt(0).toUpperCase();
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true, aspect: [1, 1], quality: 0.5, base64: true
        });
        if (!result.canceled) {
            setFormData({ ...formData, image: `data:image/jpeg;base64,${result.assets[0].base64}` });
        }
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

                        {/* Profile Image Section with Initial support and Delete button */}
                        <View style={styles.imageUploadContainer}>
                            <TouchableOpacity onPress={pickImage} style={styles.imageCircle} activeOpacity={0.8}>
                                {formData.image ? (
                                    <Image source={{ uri: formData.image }} style={{ width: '100%', height: '100%' }} />
                                ) : (
                                    <Text style={styles.initialsText}>{getInitial()}</Text>
                                )}
                            </TouchableOpacity>
                            {formData.image ? (
                                <TouchableOpacity 
                                    style={styles.removeImageBtn} 
                                    onPress={() => setFormData({ ...formData, image: '' })}
                                >
                                    <Feather name="x" size={16} color="#fff" />
                                </TouchableOpacity>
                            ) : null}
                            <Text style={{ fontSize: 11, marginTop: 5, color: theme.colors.oceanBlue }}>Click to add photo</Text>
                        </View>

                        <TextInput 
                            style={styles.seaInput} 
                            placeholder="Full Name" 
                            placeholderTextColor="#888"
                            onChangeText={(v) => setFormData({ ...formData, name: v })} 
                        />
                        <View style={{ height: 10 }} />
                        <TextInput 
                            style={styles.seaInput} 
                            placeholder="Email Address" 
                            keyboardType="email-address" 
                            autoCapitalize="none" 
                            placeholderTextColor="#888"
                            onChangeText={(v) => setFormData({ ...formData, email: v })} 
                        />
                        <View style={{ height: 10 }} />

                        {/* Password Entry with real-time validation display */}
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.seaInput} 
                                placeholder="Password" 
                                placeholderTextColor="#888"
                                secureTextEntry={!showPass} 
                                onChangeText={handlePasswordChange} 
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPass(!showPass)}>
                                <Feather name={showPass ? "eye" : "eye-off"} size={18} color="#888" />
                            </TouchableOpacity>
                        </View>

                        {formData.password.length > 0 && <PasswordCriteria criteria={passwordCriteria} />}

                        {/* Confirmation Password Input */}
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.seaInput} 
                                placeholder="Confirm Password" 
                                placeholderTextColor="#888"
                                secureTextEntry={!showConfirm} 
                                onChangeText={(v) => setFormData({ ...formData, confirmPassword: v })} 
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirm(!showConfirm)}>
                                <Feather name={showConfirm ? "eye" : "eye-off"} size={18} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
                            <Text style={styles.btnText}>Create Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 15 }}>
                            <Text style={{ color: isDarkMode ? '#fff' : '#444' }}>
                                Already have an account? <Text style={{ color: theme.colors.oceanBlue, fontWeight: 'bold' }}>Log In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppWrapper>
    );
};

export default RegisterPage;