/* client/src/components/MoveFileModal.js */
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { fetchFiles } from '../services/api';
import { getModalStyles } from '../styles/modalStyles';
import { getActionStyles } from '../styles/actionStyles';
import { Feather } from '@expo/vector-icons';

const MoveFileModal = ({ isOpen, onClose, onMove, currentFile, isDarkMode }) => {
    const { width, height } = useWindowDimensions();
    const modalStyles = getModalStyles(width, height, isDarkMode);
    const actionStyles = getActionStyles(isDarkMode);
    
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch folder list when modal opens
    useEffect(() => {
        if (isOpen) loadFolders();
    }, [isOpen]);

    const loadFolders = async () => {
        setIsLoading(true);
        try {
            const allFiles = await fetchFiles();
            // Filter only folders, excluding the item itself
            const validFolders = allFiles.filter(f => 
                f.type === 'folder' && f.id !== currentFile?.id
            );
            setFolders(validFolders);
        } catch (error) { 
            console.error(error); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <Modal visible={isOpen} transparent animationType="fade">
            <View style={modalStyles.overlay}>
                <View style={[modalStyles.modalCard, { height: '60%' }]}>
                    <Text style={modalStyles.title}>Move to...</Text>
                    
                    <Text style={{ marginBottom: 15, opacity: 0.7, color: isDarkMode ? '#fff' : '#000' }}>
                        Item: <Text style={{ fontWeight: 'bold' }}>{currentFile?.name}</Text>
                    </Text>

                    <ScrollView style={actionStyles.folderList}>
                        {/* Option for Root */}
                        <TouchableOpacity 
                            style={actionStyles.folderItem} 
                            onPress={() => onMove(null)}
                        >
                            <Feather name="home" size={20} color="#0ea5e9" />
                            <Text style={{ fontWeight: 'bold', color: isDarkMode ? '#fff' : '#333' }}>Home (Root)</Text>
                        </TouchableOpacity>

                        {isLoading ? (
                            <ActivityIndicator size="small" color="#0ea5e9" style={{ marginTop: 20 }} />
                        ) : (
                            folders.map(folder => (
                                <TouchableOpacity 
                                    key={folder.id} 
                                    style={actionStyles.folderItem} 
                                    onPress={() => onMove(folder)}
                                >
                                    <Feather name="folder" size={20} color="#888" />
                                    <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>{folder.name}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>

                    <TouchableOpacity 
                        style={[modalStyles.btnCancel, { marginTop: 20 }]} 
                        onPress={onClose}
                    >
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default MoveFileModal;