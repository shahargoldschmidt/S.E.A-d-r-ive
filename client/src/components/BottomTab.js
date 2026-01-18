/* client/src/components/BottomTab.js */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getTabStyles } from '../styles/tabStyles';
import CreateActionTab from './CreateActionTab';

const BottomTab = ({ activeTab, setActiveTab, isDarkMode }) => {
    const { width } = useWindowDimensions();
    const styles = getTabStyles(width, isDarkMode);
    const [isActionOpen, setIsActionOpen] = useState(false);

    const tabs = [
        { id: 'Home', icon: 'home' },
        { id: 'Starred', icon: 'star' },
        { id: 'Shared', icon: 'users' },
        { id: 'Trash', icon: 'trash-2' }
    ];

    return (
        <View>
            <View style={styles.tabBarContainer}>
                {/* Home & Starred */}
                {tabs.slice(0, 2).map(tab => (
                    <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
                        <Feather name={tab.icon} size={22} color={activeTab === tab.id ? theme.colors.oceanBlue : '#888'} />
                        <Text style={[styles.tabLabel, { color: activeTab === tab.id ? theme.colors.oceanBlue : '#888' }]}>{tab.id}</Text>
                    </TouchableOpacity>
                ))}

                {/* The Floating Plus Button */}
                <View style={styles.fabWrapper}>
                    <TouchableOpacity style={styles.fabButton} onPress={() => setIsActionOpen(true)}>
                        <Feather name="plus" size={30} color={isDarkMode ? '#fff' : theme.colors.creamCard} />
                    </TouchableOpacity>
                </View>

                {/* Shared & Trash */}
                {tabs.slice(2, 4).map(tab => (
                    <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
                        <Feather name={tab.icon} size={22} color={activeTab === tab.id ? theme.colors.oceanBlue : '#888'} />
                        <Text style={[styles.tabLabel, { color: activeTab === tab.id ? theme.colors.oceanBlue : '#888' }]}>{tab.id}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <CreateActionTab isOpen={isActionOpen} onClose={() => setIsActionOpen(false)} isDarkMode={isDarkMode} />
        </View>
    );
};

export default BottomTab;