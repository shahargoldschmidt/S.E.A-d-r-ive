/* client/src/components/RenameModal.js */
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native';
import { getModalStyles } from '../styles/modalStyles'; // Reusing your existing modal styles
import { getAuthStyles } from '../styles/authStyles';

const RenameModal = ({ isOpen, onClose, onRename, currentFile, isDarkMode }) => {
    const { width, height } = useWindowDimensions();
    const modalStyles = getModalStyles(width, height, isDarkMode);
    const authStyles = getAuthStyles(width, height);
    
    const [newName, setNewName] = useState('');

    // Pre-populate with current name
    useEffect(() => {
        if (isOpen && currentFile) {
            setNewName(currentFile.name);
        }
    }, [isOpen, currentFile]);

    const handleSubmit = () => {
        if (!newName.trim()) return;
        
        // Handle extension logic as in your original web code
        const parts = currentFile.name.split('.');
        const originalExt = parts.length > 1 ? parts.pop() : '';
        let finalName = newName;

        if (originalExt && !newName.toLowerCase().endsWith('.' + originalExt.toLowerCase())) {
            finalName = `${newName}.${originalExt}`;
        }

        onRename(currentFile.id, finalName);
        onClose();
    };

    return (
        <Modal visible={isOpen} transparent animationType="fade">
            <View style={modalStyles.overlay}>
                <View style={modalStyles.modalCard}>
                    <Text style={modalStyles.title}>Rename Item</Text>
                    
                    <Text style={modalStyles.label}>NEW NAME</Text>
                    <TextInput 
                        style={authStyles.seaInput}
                        value={newName}
                        onChangeText={setNewName}
                        autoFocus
                        selectTextOnFocus
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
                            <Text style={authStyles.btnText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default RenameModal;