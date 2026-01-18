/* client/src/components/Sidebar.js */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getNavbarStyles } from '../styles/navbarStyles';
import AppLogo from '../assets/Logo.png';

const Sidebar = ({ isOpen, onClose, isDarkMode, navigation }) => {
    const { width, height } = useWindowDimensions();
    const styles = getNavbarStyles(width, height, isDarkMode);

    if (!isOpen) return null;

    return (
        <Modal transparent visible={isOpen} animationType="fade">
            <TouchableOpacity style={styles.sidebarOverlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.sidebarContent}>
                    <View style={styles.sidebarHeader}>
                        <Image source={AppLogo} style={styles.sidebarLogo} resizeMode="contain" />
                        <Text style={styles.sidebarTitle}>S.E.A. D(R)IVE</Text>
                    </View>

                    <TouchableOpacity style={[styles.sidebarItem, styles.activeItem]}>
                        <Feather name="clock" size={22} color={theme.colors.oceanBlue} />
                        <Text style={[styles.sidebarText, { color: theme.colors.oceanBlue }]}>Recent</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sidebarItem}>
                        <Feather name="trash-2" size={22} color="#888" />
                        <Text style={styles.sidebarText}>Trash</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default Sidebar;