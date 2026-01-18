/* client/src/components/Navbar.js */
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { searchFiles, getUser } from '../services/api';
import { theme } from '../styles/theme';
import { getNavbarStyles } from '../styles/navbarStyles';
import Sidebar from './Sidebar';
import ProfileTab from './ProfileTab';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = ({ toggleTheme, isDarkMode, navigation }) => {
    const { width, height } = useWindowDimensions();
    const styles = getNavbarStyles(width, height, isDarkMode);
    
    const [user, setUser] = useState({ name: '', email: '', image: '' });
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    /**
     * Returns the complete icon component based on file type.
     * Centralizing icon logic for cleaner JSX.
     */
    const renderFileIcon = (type) => {
        let iconName = 'file-text';
        if (type?.toLowerCase() === 'folder') iconName = 'folder';
        if (type?.toLowerCase() === 'image') iconName = 'image';

        return (
            <View style={styles.resultIconWrapper}>
                <Feather name={iconName} size={18} color={theme.colors.oceanBlue} />
            </View>
        );
    };

    useEffect(() => {
        const fetchUser = async () => {
            const uid = await AsyncStorage.getItem('userId');
            if (uid) {
                const data = await getUser(uid);
                if (data) setUser(data);
            }
        };
        fetchUser();
    }, []);

    // Debounced search logic to prevent excessive API calls
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (query.trim().length > 0) {
                setIsSearching(true);
                try {
                    const data = await searchFiles(query);
                    setResults(data || []);
                } catch (e) {
                    console.error("Search fetch failed:", e);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 400);
        return () => clearTimeout(delay);
    }, [query]);

    return (
        <View style={styles.navContainer}>
            {/* LEFT: Mobile Sidebar Toggle */}
            <View style={styles.leftSection}>
                <TouchableOpacity onPress={() => setShowSidebar(true)}>
                    <Feather name="menu" size={26} color={isDarkMode ? '#fff' : '#444'} />
                </TouchableOpacity>
            </View>

            {/* MIDDLE: Search Engine with Dropdown */}
            <View style={styles.middleSection}>
                <View style={styles.searchWrapper}>
                    <Feather name="search" size={18} color="#888" style={{ marginRight: 8 }} />
                    <TextInput 
                        placeholder="search the depths..." 
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Feather name="x-circle" size={16} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
                
                {/* Search Result Overlay Logic */}
                {query.length > 0 && (
                    <View style={styles.searchDropdown}>
                        {isSearching ? (
                            <Text style={styles.searchStatusText}>Scanning... 🔭</Text>
                        ) : results.length === 0 ? (
                            <Text style={styles.searchStatusText}>No treasures found 🦀</Text>
                        ) : (
                            results.map(file => (
                                <TouchableOpacity key={file.id} style={styles.searchResultItem}>
                                    {/* Component returned directly from function */}
                                    {renderFileIcon(file.type)}

                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.resultName, { color: isDarkMode ? '#fff' : theme.colors.textDark }]} numberOfLines={1}>
                                            {file.name}
                                        </Text>
                                        <Text style={styles.resultMeta}>
                                            {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Recent'} • {file.owner || 'Me'}
                                        </Text>
                                    </View>

                                    {/* File size formatted from bytes to KB */}
                                    <Text style={styles.resultSize}>
                                        {file.size ? (file.size / 1024).toFixed(1) + ' KB' : ''}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}
            </View>

            {/* RIGHT: System Toggles & Profile Access */}
            <View style={styles.rightSection}>
                <TouchableOpacity onPress={toggleTheme}>
                    <Feather name={isDarkMode ? "sun" : "moon"} size={22} color={isDarkMode ? "#FFD700" : "#444"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.avatarBtn} onPress={() => setShowProfile(true)}>
                    {user.image ? (
                        <Image source={{ uri: user.image }} style={styles.avatarImg} />
                    ) : (
                        <View style={styles.avatarInitial}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>{user.name?.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} isDarkMode={isDarkMode} />
            <ProfileTab isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} isDarkMode={isDarkMode} navigation={navigation} />
        </View>
    );
};

export default Navbar;