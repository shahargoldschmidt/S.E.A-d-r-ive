/* client/src/components/ImagePickerSheet.js */
import React from 'react';
import { View, Text, Modal, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getActionStyles } from '../styles/actionStyles';
import { FileManager } from '../utils/FileManager';
import { theme } from '../styles/theme';

const ImagePickerSheet = ({ isVisible, onClose, onImagePicked, isDarkMode }) => {
    const { width, height } = useWindowDimensions();
    const styles = getActionStyles(width, height, isDarkMode);

    const handlePick = async (useCamera) => {
        const result = await FileManager.pickImage(useCamera);
        if (result) {
            // we return the base64 formatted string ready for your API
            onImagePicked(`data:image/jpeg;base64,${result.base64}`);
        }
        onClose();
    };

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <TouchableOpacity 
                style={styles.sheetOverlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} style={styles.sheetContent}>
                    <View style={styles.sheetHandle} />
                    
                    <Text style={{ 
                        textAlign: 'center', 
                        fontSize: 18, 
                        fontWeight: 'bold', 
                        marginBottom: 20,
                        color: isDarkMode ? '#fff' : theme.colors.deepNavy 
                    }}>
                        Select Photo Source
                    </Text>

                    {/* Option: Camera */}
                    <TouchableOpacity 
                        style={styles.actionItem} 
                        onPress={() => handlePick(true)}
                    >
                        <View style={{ width: 40 }}>
                            <Feather name="camera" size={24} color={theme.colors.oceanBlue} />
                        </View>
                        <Text style={styles.actionText}>Take a Photo</Text>
                    </TouchableOpacity>

                    {/* Option: Gallery */}
                    <TouchableOpacity 
                        style={styles.actionItem} 
                        onPress={() => handlePick(false)}
                    >
                        <View style={{ width: 40 }}>
                            <Feather name="image" size={24} color={theme.colors.oceanBlue} />
                        </View>
                        <Text style={styles.actionText}>Choose from Gallery</Text>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity 
                        style={[styles.actionItem, { marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }]} 
                        onPress={onClose}
                    >
                        <Text style={[styles.actionText, { color: '#ff5252', width: '100%', textAlign: 'center' }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default ImagePickerSheet;