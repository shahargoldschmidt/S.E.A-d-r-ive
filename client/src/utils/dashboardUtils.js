/* client/src/utils/dashboardUtils.js */
import React from 'react';
import { Icons } from './Icons';


export const isToday = (dateStr) => {
    if (!dateStr) return false;
    const fileDate = new Date(dateStr);
    const today = new Date();
    return fileDate.toDateString() === today.toDateString();
};

// Formatting for Israel locale with fallback
export const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('he-IL', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    } catch (e) {
        return dateStr.split('T')[0]; // Simple fallback
    }
};

// Improved size formatter
export const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};
export const getFileIcon = (type, size = 24) => {
    const fileType = type?.toLowerCase();
    if (fileType === 'folder') return <Icons.Folder size={size} color="#0ea5e9" />;
    if (fileType === 'image') return <Icons.Image size={size} color="#4facfe" />;
    return <Icons.FileText size={size} color="#64748b" />;
};