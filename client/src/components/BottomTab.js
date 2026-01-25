/* client/src/components/BottomTab.js */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getTabStyles } from '../styles/tabStyles';
import CreateActionTab from './CreateActionTab';

const BottomTab = ({ activeTab, setActiveTab, onActionSelect, isDarkMode }) => {
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
                {/* Home & Starred Tabs */}
                {tabs.slice(0, 2).map(tab => (
                    <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
                        <Feather name={tab.icon} size={22} color={activeTab === tab.id ? theme.colors.oceanBlue : '#888'} />
                        <Text style={[styles.tabLabel, { color: activeTab === tab.id ? theme.colors.oceanBlue : '#888' }]}>{tab.id}</Text>
                    </TouchableOpacity>
                ))}

                {/* Central Floating Plus Button to open CreateActionTab */}
                <View style={styles.fabWrapper}>
                    <TouchableOpacity style={styles.fabButton} onPress={() => setIsActionOpen(true)}>
                        <Feather name="plus" size={30} color={isDarkMode ? '#fff' : theme.colors.creamCard} />
                    </TouchableOpacity>
                </View>

                {/* Shared & Trash Tabs */}
                {tabs.slice(2, 4).map(tab => (
                    <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
                        <Feather name={tab.icon} size={22} color={activeTab === tab.id ? theme.colors.oceanBlue : '#888'} />
                        <Text style={[styles.tabLabel, { color: activeTab === tab.id ? theme.colors.oceanBlue : '#888' }]}>{tab.id}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Passing the onActionSelect handler as 'onSelect' to the action menu */}
            <CreateActionTab 
                isOpen={isActionOpen} 
                onClose={() => setIsActionOpen(false)} 
                onSelect={onActionSelect} 
                isDarkMode={isDarkMode} 
            />
        </View>
    );
};

export default BottomTab;