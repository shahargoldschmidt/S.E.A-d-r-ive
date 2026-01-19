/* client/src/utils/dashboardUtils.js */

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