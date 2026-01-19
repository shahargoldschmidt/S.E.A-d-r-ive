/* client/src/components/CreateActionTab.js */
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getTabStyles } from '../styles/tabStyles';

const CreateActionTab = ({ isOpen, onClose, isDarkMode }) => {
    const styles = getTabStyles(0, isDarkMode);

    const actions = [
        { label: 'New Folder', icon: 'folder-plus', color: '#4facfe' },
        { label: 'New Text', icon: 'file-text', color: '#00f2fe' },
        { label: 'Upload File', icon: 'upload', color: '#00acc1' },
        { label: 'Upload Photo', icon: 'image', color: '#7b1fa2' }
    ];

    return (
        <Modal visible={isOpen} transparent animationType="slide">
            <TouchableOpacity style={styles.actionModalOverlay} activeOpacity={1} onPress={onClose}>
                <View style={[styles.actionSheet, { backgroundColor: isDarkMode ? theme.colors.darkBg : '#fff' }]}>
                    <View style={{ width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 3, alignSelf: 'center', marginBottom: 20 }} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#fff' : theme.colors.deepNavy, textAlign: 'center' }}>
                        Start a New Dive
                    </Text>
                    
                    <View style={styles.actionGrid}>
                        {actions.map((item, idx) => (
                            <TouchableOpacity key={idx} style={styles.actionItem} onPress={onClose}>
                                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: item.color + '20', justifyContent: 'center', alignItems: 'center' }}>
                                    <Feather name={item.icon} size={24} color={item.color} />
                                </View>
                                <Text style={{ color: isDarkMode ? '#ccc' : '#444', fontWeight: '600' }}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default CreateActionTab;