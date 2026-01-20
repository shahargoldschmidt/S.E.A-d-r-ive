/* client/src/components/FileEditorView.js */
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Image, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getEditorStyles } from '../styles/editorStyles';
import { theme } from '../styles/theme';
import AppWrapper from './AppWrapper';
import * as ImagePicker from 'expo-image-picker';
import { getFileIcon } from '../utils/dashboardUtils';

const FileEditorView = ({ 
    isOpen, 
    file, 
    onBack, 
    onSave, 
    currentUser, 
    isDarkMode,
    renderFileIcon 
}) => {
    const { width, height } = useWindowDimensions();
    const styles = getEditorStyles(width, height, isDarkMode);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial setup and extension handling
    useEffect(() => {
        if (file) {
            const parts = file.name ? file.name.split('.') : [];
            const cleanName = parts.length > 1 ? parts.slice(0, -1).join('.') : file.name;
            
            setTitle(cleanName);
            setContent(file.content || '');
            setIsEditing(false);
        }
    }, [file, isOpen]);

    const isImage = file?.type === 'image' || /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file?.name);

    // Permission Logic
    const getUserRole = () => {
        if (!currentUser || !file) return 'none';
        if (file.owner === currentUser.email || file.userId === currentUser.id) return 'ADMIN';
        const perm = file.permissions?.find(p => p.email === currentUser.email);
        return perm ? perm.role : 'none'; // Keeping 'role' as requested
    };

    const canEdit = ['ADMIN', 'EDITOR'].includes(getUserRole());

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const originalExt = file.name.includes('.') ? file.name.split('.').pop() : '';
            const finalName = originalExt && !title.toLowerCase().endsWith('.' + originalExt.toLowerCase()) 
                ? `${title}.${originalExt}` 
                : title;

            await onSave(file.id, { name: finalName, content });
            Alert.alert("Dive Success", "Your changes have been stored.");
            setIsEditing(false);
        } catch (e) {
            Alert.alert("Error", "Could not save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            const base64Data = result.assets[0].base64;
            setContent(base64Data);
            // Save immediately for images as in Web version
            onSave(file.id, { content: base64Data });
        }
    };

    const getImageUrl = () => {
        if (!content) return null;
        return content.startsWith('data:image') ? content : `data:image/png;base64,${content}`;
    };

    if (!file) return null;

    return (
        <Modal visible={isOpen} animationType="slide">
            <AppWrapper isDarkMode={isDarkMode}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    
                    {/* Header: Identical to CreateFileView structure */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={onBack}>
                                <Feather name="chevron-left" size={32} color="#fff" />
                            </TouchableOpacity>
                            <View style={styles.titleContainer}>
                                {isEditing ? (
                                    <TextInput 
                                        style={styles.titleInput} 
                                        value={title} 
                                        onChangeText={setTitle}
                                        autoFocus
                                    />
                                ) : (
                                    <Text style={styles.fileTitle} numberOfLines={1}>
                                       {getFileIcon(file.type, 22)}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.headerActions}>
                            {canEdit && (
                                isEditing ? (
                                    <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                                        {isSaving ? <ActivityIndicator color="#fff" /> : <Feather name="check" size={26} color="#fff" />}
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => isImage ? handlePickImage() : setIsEditing(true)}>
                                        <Feather name={isImage ? "camera" : "edit-3"} size={24} color="#fff" />
                                    </TouchableOpacity>
                                )
                            )}
                            {isEditing && (
                                <TouchableOpacity onPress={() => { setIsEditing(false); setContent(file.content); }}>
                                    <Feather name="x" size={26} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Content Area */}
                    <View style={styles.contentCard}>
                        {isImage ? (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: getImageUrl() }} style={styles.fullImage} />
                            </View>
                        ) : (
                            <TextInput 
                                style={styles.textInput}
                                multiline
                                value={content}
                                onChangeText={setContent}
                                editable={isEditing}
                                placeholder="Empty waters..."
                            />
                        )}
                    </View>

                </KeyboardAvoidingView>
            </AppWrapper>
        </Modal>
    );
};

export default FileEditorView;