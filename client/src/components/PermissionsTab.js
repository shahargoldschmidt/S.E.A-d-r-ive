/* client/src/components/PermissionsTab.js */
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { addPermission, updatePermission, getPermissions, removePermission } from '../services/api';
import { getPermissionStyles } from '../styles/permissionStyles';
import { getAuthStyles } from '../styles/authStyles';
import { theme } from '../styles/theme';
import AppWrapper from './AppWrapper';

const PermissionsTab = ({ isOpen, onClose, onSave, file, isDarkMode, renderFileIcon }) => {
    const { width, height } = useWindowDimensions();
    const styles = getPermissionStyles(width, height, isDarkMode);
    const authStyles = getAuthStyles(width, height);

    const [collaborators, setCollaborators] = useState([]);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('VIEWER');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* Fetch current file permissions on open */
    useEffect(() => {
        if (isOpen && file) {
            loadPermissions();
            setNewUserEmail('');
            setErrorMsg('');
        }
    }, [isOpen, file]);

    const loadPermissions = async () => {
        setIsLoading(true);
        try {
            const perms = await getPermissions(file.id);
            setCollaborators(perms);
        } catch (error) {
            setCollaborators(file.permissions || []); // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles adding a new user to the file depths
     */
    const handleAddUser = async () => {
        if (!newUserEmail.trim()) return false;
        setIsLoading(true);
        setErrorMsg('');

        try {
            const newPerm = await addPermission(file.id, newUserEmail, newUserRole);
            const updatedUser = { ...newPerm, email: newUserEmail, role: newUserRole };
            setCollaborators(prev => [...prev, updatedUser]);
            onSave(file.id, { permissions: [...collaborators, updatedUser] });
            setNewUserEmail('');
            return true;
        } catch (err) {
            setErrorMsg(err.message || 'Failed to add permission');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /* Smart Action: Saves input if exists, or just closes */
    const handleSmartAction = async () => {
        if (newUserEmail.trim().length > 0) {
            const success = await handleAddUser();
            if (success) onClose();
        } else {
            onClose();
        }
    };

    const handleRemoveUser = (email) => {
        Alert.alert("Remove Access", `Are you sure you want to remove ${email}?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Remove", style: "destructive", onPress: async () => {
                const userPerm = collaborators.find(c => c.email === email);
                if (!userPerm || !userPerm.id) return;
                try {
                    await removePermission(file.id, userPerm.id);
                    setCollaborators(prev => prev.filter(c => c.email !== email));
                } catch (error) { setErrorMsg("Failed to remove user"); }
            }}
        ]);
    };

    const roles = ['VIEWER', 'EDITOR', 'ADMIN'];

    return (
        <Modal visible={isOpen} animationType="slide">
            <AppWrapper isDarkMode={isDarkMode}>
                <View style={styles.container}>
                    {/* Header with File Info */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="arrow-left" size={28} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 10 }}>
                            {renderFileIcon(file?.type)}
                        </View>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            Manage Access: {file?.name}
                        </Text>
                    </View>

                    <ScrollView keyboardShouldPersistTaps="handled">
                        {/* New Collaborator Entry */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>INVITE BY EMAIL</Text>
                            <TextInput 
                                style={authStyles.seaInput}
                                placeholder="Enter user email..."
                                placeholderTextColor="#888"
                                value={newUserEmail}
                                onChangeText={setNewUserEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <View style={styles.roleSelector}>
                                {roles.map(r => (
                                    <TouchableOpacity 
                                        key={r} 
                                        style={[styles.roleButton, newUserRole === r && styles.roleButtonActive]}
                                        onPress={() => setNewUserRole(r)}
                                    >
                                        <Text style={[styles.roleButtonText, { color: newUserRole === r ? '#fff' : theme.colors.oceanBlue }]}>
                                            {r}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            
                            {errorMsg ? <Text style={{ color: 'red', marginTop: 10 }}>⚠️ {errorMsg}</Text> : null}
                        </View>

                        {/* Collaborator List */}
                        <View style={{ padding: 20 }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 15 }}>
                                PEOPLE WITH ACCESS
                            </Text>
                            
                            {isLoading ? <ActivityIndicator color={theme.colors.oceanBlue} /> : (
                                collaborators.map((user, index) => (
                                    <View key={user.id || index} style={styles.collabRow}>
                                        {/* User Avatar Initial */}
                                        <View style={styles.avatarSmall}>
                                            <Text style={styles.avatarText}>{user.email.charAt(0).toUpperCase()}</Text>
                                        </View>

                                        <View style={styles.collabInfo}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.collabEmail} numberOfLines={1}>{user.email}</Text>
                                                {user.email === file?.owner && (
                                                    <View style={{ backgroundColor: '#0ea5e920', paddingHorizontal: 6, borderRadius: 4, marginLeft: 8 }}>
                                                        <Text style={{ fontSize: 9, color: '#0ea5e9', fontWeight: 'bold' }}>OWNER</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.roleBadge}>{user.role || user.type || 'VIEWER'}</Text>
                                        </View>

                                        {user.email !== file?.owner && (
                                            <TouchableOpacity onPress={() => handleRemoveUser(user.email)}>
                                                <Feather name="x" size={20} color="#94a3b8" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))
                            )}
                        </View>
                    </ScrollView>

                    {/* Bottom Action Button */}
                    <View style={{ padding: 20, paddingBottom: 40 }}>
                        <TouchableOpacity style={authStyles.btnPrimary} onPress={handleSmartAction}>
                            <Text style={authStyles.btnText}>
                                {newUserEmail.trim().length > 0 ? "Add & Done" : "Done"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </AppWrapper>
        </Modal>
    );
};

export default PermissionsTab;