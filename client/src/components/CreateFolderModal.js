/* client/src/components/CreateFolderModal.js */
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { getModalStyles } from '../styles/modalStyles';
import { getAuthStyles } from '../styles/authStyles';

const CreateFolderModal = ({ isOpen, onClose, onCreate, isDarkMode }) => {
    const { width, height } = useWindowDimensions();
    const modalStyles = getModalStyles(width, height, isDarkMode);
    const authStyles = getAuthStyles(width, height);
    
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState('');

    /**
     * Validates input and triggers the creation via Dashboard logic.
     */
    const handleSubmit = () => {
        if (!folderName.trim()) {
            setError('Folder name is missing!');
            return;
        }
        onCreate(folderName); 
        Alert.alert("Success!", `Treasure Chest "${folderName}" stored in the depths.`);
        setFolderName('');
        setError('');
        onClose();
    };

    return (
        <Modal visible={isOpen} transparent animationType="fade">
            <View style={modalStyles.overlay}>
                <View style={modalStyles.modalCard}>
                    <Text style={modalStyles.title}>New Folder 📂</Text>
                    
                    {error ? <Text style={modalStyles.errorText}>{error}</Text> : null}
                    
                    <Text style={modalStyles.label}>NAME</Text>
                    <TextInput 
                        style={authStyles.seaInput}
                        placeholder="e.g. Vacation, Documents..."
                        placeholderTextColor="#94a3b8"
                        value={folderName}
                        onChangeText={setFolderName}
                        autoFocus
                    />

                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 25 }}>
                        <TouchableOpacity 
                            style={[authStyles.btnPrimary, { flex: 1, backgroundColor: '#64748b' }]} 
                            onPress={onClose}
                        >
                            <Text style={authStyles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[authStyles.btnPrimary, { flex: 1 }]} 
                            onPress={handleSubmit}
                        >
                            <Text style={authStyles.btnText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CreateFolderModal;