/* client/src/components/ProfileTab.js */
import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Alert, useWindowDimensions, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';

const ProfileTab = ({ isOpen, onClose, user, isDarkMode, navigation }) => {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    /**
     * Professional Logout with Confirmation Alert
     */
    const handleLogout = () => {
        Alert.alert(
            "Logging Out",
            "Are you sure you want to return to the shore?",
            [
                { text: "Stay Diving", style: "cancel" },
                { 
                    text: "Logout", 
                    style: "destructive", 
                    onPress: async () => {
                        await AsyncStorage.clear(); // Clears token & userId
                        onClose();
                        navigation.replace('Login'); // Prevent going back to Dashboard
                    } 
                }
            ]
        );
    };

    return (
        <Modal visible={isOpen} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={[
                    styles.tabContent, 
                    { 
                        backgroundColor: isDarkMode ? theme.colors.darkBg : '#fff',
                        height: isLandscape ? '90%' : '65%' // Adaptive height
                    }
                ]}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Feather name="x" size={24} color={isDarkMode ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
                        <Text style={[styles.title, { color: isDarkMode ? '#fff' : theme.colors.deepNavy }]}>
                            My Profile
                        </Text>

                        <View style={styles.avatarWrapper}>
                            {user.image ? (
                                <Image source={{ uri: user.image }} style={styles.avatarLarge} />
                            ) : (
                                <View style={styles.placeholderLarge}>
                                    <Text style={styles.initialTextLarge}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.infoContainer}>
                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Full Name</Text>
                                <Text style={[styles.value, { color: isDarkMode ? '#fff' : theme.colors.textDark }]}>
                                    {user.name}
                                </Text>
                            </View>
                            
                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Email Address</Text>
                                <Text style={[styles.value, { color: isDarkMode ? '#fff' : theme.colors.textDark }]}>
                                    {user.email}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Feather name="log-out" size={20} color="#fff" style={{ marginRight: 10 }} />
                            <Text style={styles.logoutText}>Logout from S.E.A.</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

/**
 * Optimized styles for the Profile Sliding Tab.
 */
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end', // Slides from bottom like a modern mobile tab
    },
    tabContent: {
        height: '65%',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        padding: 25,
        alignItems: 'center',
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 15,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
        letterSpacing: 0.5,
    },
    avatarWrapper: {
        marginBottom: 25,
        elevation: 5,
    },
    avatarLarge: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: theme.colors.oceanBlue,
    },
    placeholderLarge: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: theme.colors.oceanBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialTextLarge: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
    },
    infoContainer: {
        width: '100%',
        marginBottom: 35,
        backgroundColor: 'rgba(0,0,0,0.02)', // Subtle grouping background
        borderRadius: 20,
        padding: 15,
    },
    infoItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    label: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        marginBottom: 4,
        fontWeight: '600',
    },
    value: {
        fontSize: 17,
        fontWeight: '600',
    },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: theme.colors.error,
        paddingVertical: 16,
        paddingHorizontal: 45,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 3,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileTab;