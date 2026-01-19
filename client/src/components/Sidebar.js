/* client/src/components/Sidebar.js */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal, 
    Image, 
    useWindowDimensions, 
    Alert,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icons } from '../utils/Icons'; // Using our unified icon system
import { theme } from '../styles/theme';
import { getNavbarStyles } from '../styles/navbarStyles';
import AppLogo from '../assets/Logo.png';

/**
 * Sidebar Component for S.E.A. D(R)IVE Native.
 * Provides navigation for 'Recent', 'Trash' and 'Logout' actions.
 */
const Sidebar = ({ isOpen, onClose, isDarkMode, navigation, activeTab, setActiveTab }) => {
    const { width, height } = useWindowDimensions();
    const styles = getNavbarStyles(width, height, isDarkMode);

    // If the sidebar isn't triggered, don't render anything
    if (!isOpen) return null;

    /**
     * handleLogout: Clears user session and navigates to the login shore.
     * Includes a confirmation alert for professional UX.
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
                        try {
                            // Clear all dive data from storage
                            await AsyncStorage.clear();
                            onClose();
                            // Redirect to login and reset navigation stack
                            navigation.replace('Login'); 
                        } catch (error) {
                            console.error("Logout drift detected:", error);
                        }
                    } 
                }
            ]
        );
    };

    /**
     * handleNavigation: Updates the global active tab and closes the menu.
     * Syncs with DashboardPage state.
     */
    const handleNavigation = (tabName) => {
        setActiveTab(tabName);
        onClose();
    };

    return (
        <Modal transparent visible={isOpen} animationType="fade">
            <TouchableOpacity 
                style={styles.sidebarOverlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                {/* Main Sidebar Container - Uses space-between to push logout to bottom */}
                <View style={[styles.sidebarContent, { justifyContent: 'space-between' }]}>
                    
                    {/* Top Section: Branding and Main Navigation */}
                    <View>
                        {/* Branding Header */}
                        <View style={styles.sidebarHeader}>
                            <Image source={AppLogo} style={styles.sidebarLogo} resizeMode="contain" />
                            <Text style={styles.sidebarTitle}>S.E.A. D(R)IVE</Text>
                        </View>

                        {/* Recent Dives Tab: Filters files by recent activity */}
                        <TouchableOpacity 
                            style={[styles.sidebarItem, activeTab === 'Recent' && styles.activeItem]}
                            onPress={() => handleNavigation('Recent')}
                        >
                            <Icons.Clock 
                                size={22} 
                                color={activeTab === 'Recent' ? theme.colors.oceanBlue : '#888'} 
                            />
                            <Text style={[
                                styles.sidebarText, 
                                activeTab === 'Recent' && { color: theme.colors.oceanBlue }
                            ]}>
                                Recent Dives
                            </Text>
                        </TouchableOpacity>

                        {/* Trash Bin Tab: Displays soft-deleted items */}
                        <TouchableOpacity 
                            style={[styles.sidebarItem, activeTab === 'Trash' && styles.activeItem]}
                            onPress={() => handleNavigation('Trash')}
                        >
                            <Icons.Trash 
                                size={22} 
                                color={activeTab === 'Trash' ? theme.colors.error : '#888'} 
                            />
                            <Text style={[
                                styles.sidebarText, 
                                activeTab === 'Trash' && { color: theme.colors.error }
                            ]}>
                                Trash Bin
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Section: Authentication & Exit */}
                    <View style={localStyles.footerContainer}>
                        <TouchableOpacity 
                            style={styles.sidebarItem} 
                            onPress={handleLogout}
                        >
                            <Icons.Logout size={22} color="#ff5252" />
                            <Text style={[styles.sidebarText, { color: '#ff5252' }]}>
                                Logout from S.E.A.
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableOpacity>
        </Modal>
    );
};

// Local specific styles for the footer area
const localStyles = StyleSheet.create({
    footerContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 10,
        marginBottom: 10
    }
});

export default Sidebar;