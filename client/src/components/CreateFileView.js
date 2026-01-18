/* client/src/components/CreateFileView.js */
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getModalStyles } from '../styles/modalStyles';
import { getAuthStyles } from '../styles/authStyles';
import AppWrapper from './AppWrapper';

const CreateFileView = ({ isOpen, onClose, onCreate, isDarkMode }) => {
    const { width, height } = useWindowDimensions();
    const modalStyles = getModalStyles(width, height, isDarkMode);
    const authStyles = getAuthStyles(width, height);
    
    const [fileName, setFileName] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    /**
     * Handles file creation, appends extension, and shows success alert.
     */
    const handleSubmit = () => {
        if (!fileName.trim()) {
            setError('File name is missing!');
            return;
        }

        // Logic from web version: Ensure .txt extension
        const finalName = fileName.toLowerCase().endsWith('.txt') ? fileName : `${fileName}.txt`;
        
        // Triggers API call
        onCreate(finalName, content); 
        
        // Feedback as requested: Success alert before closing
        Alert.alert("Success!", `Treasure "${finalName}" stored in the depths.`);
        
        setFileName('');
        setContent('');
        onClose(); // Returns to previous view
    };

    return (
        <Modal visible={isOpen} animationType="slide">
            <AppWrapper isDarkMode={isDarkMode}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                    style={{ flex: 1 }}
                >
                    {/* Header with back button acting as Cancel */}
                    <View style={modalStyles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="chevron-left" size={32} color="#fff" />
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>
                            New Text File
                        </Text>
                    </View>

                    <View style={[modalStyles.modalCard, { width: '92%', height: '80%', alignSelf: 'center', maxWidth: 600 }]}>
                        {error ? <Text style={modalStyles.errorText}>{error}</Text> : null}
                        
                        <Text style={modalStyles.label}>FILE NAME</Text>
                        <TextInput 
                            style={authStyles.seaInput}
                            placeholder="my-discovery"
                            value={fileName}
                            onChangeText={setFileName}
                        />

                        <View style={{ height: 20 }} />

                        <Text style={modalStyles.label}>CONTENT</Text>
                        <TextInput 
                            style={[authStyles.seaInput, { height: 200, borderRadius: 15, textAlignVertical: 'top', paddingTop: 15 }]}
                            placeholder="Type your notes here..."
                            multiline
                            value={content}
                            onChangeText={setContent}
                        />

                        {/* Action buttons aligned to bottom */}
                        <View style={{ flexDirection: 'row', gap: 15, marginTop: 'auto' }}>
                            <TouchableOpacity 
                                style={[authStyles.btnPrimary, { flex: 1, backgroundColor: '#ef4444' }]} 
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
                </KeyboardAvoidingView>
            </AppWrapper>
        </Modal>
    );
};

export default CreateFileView;