/* client/src/components/ActionMenuSheet.js */
import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Now we will use this component
import { getActionStyles } from '../styles/actionStyles';

const ActionMenuSheet = ({ visible, onClose, actions, isDarkMode }) => {
    const { width, height } = useWindowDimensions();
    // Passing dimensions to getActionStyles for orientation awareness
    const styles = getActionStyles(width, height, isDarkMode);

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity 
                style={styles.sheetOverlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} style={styles.sheetContent}>
                    <View style={styles.sheetHandle} />
                    
                    <ScrollView>
                        {actions.map((action, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.actionItem} 
                                onPress={() => {
                                    action.onPress();
                                    onClose();
                                }}
                            >
                                {/* Using Feather component with action.iconName */}
                                <View style={{ width: 24, alignItems: 'center' }}>
                                    <Feather 
                                        name={action.iconName || 'file'} 
                                        size={20} 
                                        color={action.danger ? '#e74c3c' : (isDarkMode ? '#fff' : '#444')} 
                                    />
                                </View>
                                <Text style={[
                                    styles.actionText, 
                                    action.danger && styles.dangerText
                                ]}>
                                    {action.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default ActionMenuSheet;