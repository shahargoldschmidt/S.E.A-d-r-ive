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
import { getFileIcon } from '../utils/dashboardUtils';

/* Added activeTab, setActiveTab and onFileClick props for full sync */
const Navbar = ({ toggleTheme, isDarkMode, navigation, activeTab, setActiveTab, onFileClick }) => {
    const { width, height } = useWindowDimensions();
    const styles = getNavbarStyles(width, height, isDarkMode);
    
    const [user, setUser] = useState({ name: '', email: '', image: '' });
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

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

    /* Function to handle selection from search results */
    const handleResultSelect = (file) => {
        setQuery(''); // Clear search
        setResults([]);
        onFileClick(file); // Trigger opening in Dashboard
    };

    return (
        <View style={styles.navContainer}>
            <View style={styles.leftSection}>
                <TouchableOpacity onPress={() => setShowSidebar(true)}>
                    <Feather name="menu" size={26} color={isDarkMode ? '#fff' : '#444'} />
                </TouchableOpacity>
            </View>

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
                
                {query.length > 0 && (
                    <View style={styles.searchDropdown}>
                        {isSearching ? (
                            <Text style={styles.searchStatusText}>Scanning... 🔭</Text>
                        ) : results.length === 0 ? (
                            <Text style={styles.searchStatusText}>No treasures found 🦀</Text>
                        ) : (
                            results.map(file => (
                                <TouchableOpacity 
                                    key={file.id} 
                                    style={styles.searchResultItem}
                                    onPress={() => handleResultSelect(file)} /* Integrated onPress */
                                >
                                    {getFileIcon(file.type, 18)}
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.resultName, { color: isDarkMode ? '#fff' : '#334155' }]} numberOfLines={1}>
                                            {file.name}
                                        </Text>
                                        <Text style={styles.resultMeta}>
                                            {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Recent'} • {file.owner || 'Me'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}
            </View>

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

            {/* Now passing all required sync props to Sidebar */}
            <Sidebar 
                isOpen={showSidebar} 
                onClose={() => setShowSidebar(false)} 
                isDarkMode={isDarkMode} 
                navigation={navigation}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            
            <ProfileTab 
                isOpen={showProfile} 
                onClose={() => setShowProfile(false)} 
                user={user} 
                isDarkMode={isDarkMode} 
                navigation={navigation} 
            />
        </View>
    );
};

export default Navbar;