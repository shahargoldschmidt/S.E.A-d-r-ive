/* client/src/components/Dashboard/FileList.js */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Icons } from '../../utils/Icons'; // Using our new Native Icons
import { getFileListStyles } from '../../styles/fileListStyles';

const FileList = ({ 
    files, 
    starredIds, 
    handleItemClick, 
    handleToggleStar, 
    onOpenActionMenu, 
    formatDate, 
    formatSize, 
    isDarkMode 
}) => {
    const { width, height } = useWindowDimensions();
    const styles = getFileListStyles(width, height, isDarkMode);

    const renderItem = ({ item }) => {
        const isStarred = starredIds.has(item.id);
        
        // --- Smart Icon Logic ---
        const renderTypeIcon = () => {
            const type = item.type?.toLowerCase();
            const iconSize = width > height ? 22 : 28; // Smaller icons in landscape

            if (type === 'folder') return <Icons.Folder size={iconSize} color="#0ea5e9" />;
            if (type === 'image') return <Icons.Image size={iconSize} color="#4facfe" />;
            return <Icons.FileText size={iconSize} color="#64748b" />; // Default for .txt or unknown
        };

        return (
            <TouchableOpacity 
                style={styles.fileRow} 
                onPress={() => handleItemClick(item)}
                activeOpacity={0.7}
            >
                {/* LEFT: Dynamic Icon based on File Type */}
                <View style={styles.iconWrapper}>
                    {renderTypeIcon()}
                </View>

                {/* MIDDLE: File Name & Details */}
                <View style={styles.infoWrapper}>
                    <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.fileMeta}>
                        {formatDate(item.createdAt)} • {formatSize(item.size)}
                    </Text>
                </View>

                {/* RIGHT: Visual Layout (Star on Top, Kebab on Bottom) */}
                <View style={styles.rightActions}>
                    {/* Star Button (Top) */}
                    <TouchableOpacity 
                        style={styles.actionTouch} 
                        onPress={() => handleToggleStar(item.id)}
                    >
                        <Icons.Star 
                            size={18} 
                            filled={isStarred} 
                            color={isStarred ? '#f4b400' : '#ccc'} 
                        />
                    </TouchableOpacity>

                    {/* Action Menu Button (Bottom) */}
                    <TouchableOpacity 
                        style={styles.actionTouch} 
                        onPress={() => onOpenActionMenu(item)}
                    >
                        <Icons.MenuDots size={18} color="#888" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={files}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            // Optimization for orientation changes
            removeClippedSubviews={Platform.OS === 'android'}
        />
    );
};

export default FileList;