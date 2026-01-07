export const isToday = (dateStr) => {
    const fileDate = new Date(dateStr);
    const today = new Date();
    return fileDate.getDate() === today.getDate() &&
           fileDate.getMonth() === today.getMonth() &&
           fileDate.getFullYear() === today.getFullYear();
};

export const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('he-IL') : '-';
export const formatSize = (bytes) => bytes ? `${(bytes/1024).toFixed(1)} KB` : '-';