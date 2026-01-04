/* client/src/services/api.js */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// helper function for header with token 
const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token'); // שימוש ב-sessionStorage
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '' 
    };
};

// --- Helper for consistent Error Handling & Auto-Logout ---
const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            window.location.href = '/login'; 
            throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Request failed');
    }
    return response;
};

// --- AUTH FUNCTIONS ---

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/tokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        
        // שמירה ב-sessionStorage
        if (data.token) sessionStorage.setItem('token', data.token);
        if (data.userId) sessionStorage.setItem('userId', data.userId);
        
        return data; 
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getUser = async (userId) => {
    try {
        const idToFetch = userId || sessionStorage.getItem('userId');
        if (!idToFetch) return null;

        const response = await fetch(`${API_URL}/users/${idToFetch}`, {
            method: 'GET',
            headers: getAuthHeaders() 
        });

        await handleResponse(response);
        return await response.json();
    } catch (error) {
        console.warn("Get User Error:", error);
        return null;
    }
};

// --- FILE FUNCTIONS ---

export const fetchFiles = async () => {
    try {
        const response = await fetch(`${API_URL}/files`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        await handleResponse(response); 
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const createFile = async (fileData) => {
    try {
        const response = await fetch(`${API_URL}/files`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(fileData)
        });
        await handleResponse(response);
        return true;
    } catch (error) {
        throw error;
    }
};

export const getFileById = async (fileId) => {
    try {
        const response = await fetch(`${API_URL}/files/${fileId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        await handleResponse(response);
        return await response.json(); 
    } catch (error) {
        throw error;
    }
};

export const updateFile = async (fileId, updates) => {
    try {
        const response = await fetch(`${API_URL}/files/${fileId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });
        await handleResponse(response);
        return true;
    } catch (error) {
        throw error;
    }
};

export const searchFiles = async (query) => {
    try {
        const response = await fetch(`${API_URL}/search/${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        await handleResponse(response);
        return await response.json();
    } catch (error) {
        console.error("Search error:", error);
        return []; 
    }
};

// הוספת הרשאה לקובץ (שולחים מייל, השרת מטפל בשאר)
export const addPermission = async (fileId, email, type) => {
    try {
        // אנחנו פונים לאותו נתיב בדיוק שהיה לך קודם
        const response = await fetch(`${API_URL}/files/${fileId}/permissions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ email, type }) // שולחים את המייל והסוג
        });

        await handleResponse(response);
        return await response.json();
    } catch (error) {
        throw error;
    }
};
// עדכון הרשאה קיימת (שינוי סוג הרשאה)
export const updatePermission = async (fileId, permissionId, newType) => {
    try {
        // שים לב: הנתיב בשרת שלך הוא /api/files/:id/permissions/:pId
        const response = await fetch(`${API_URL}/files/${fileId}/permissions/${permissionId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ type: newType })
        });
        await handleResponse(response);
        return await response.json();
    } catch (error) { throw error; }
};