/* client/src/services/api.js */
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.REACT_APP_API_URL || "http://192.168.1.141:3000/api";

/* Helper function to generate authorization headers using the stored session token */
const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '' 
    };
};

/* Centralized response handler for consistent error management and session expiration */
const handleResponse = async (response) => {
    if (!response.ok) {
        /* Auto-logout if the session is no longer valid */
        if (response.status === 401 || response.status === 403) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            window.location.href = '/login'; 
            throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Request failed');
    }
    return response;
};

/* --- AUTHENTICATION FUNCTIONS --- */

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
        
        /* Store authentication data in AsyncStorage for session persistence */
        if (data.token) await AsyncStorage.setItem('token', data.token);
        if (data.userId) await AsyncStorage.setItem('userId', data.userId);
        
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
        const idToFetch = userId || await AsyncStorage.getItem('userId');
        if (!idToFetch) return null;

        const response = await fetch(`${API_URL}/users/${idToFetch}`, {
            method: 'GET',
            headers: await getAuthHeaders() 
        });

        await handleResponse(response);
        return await response.json();
    } catch (error) {
        console.warn("Get User Error:", error);
        return null;
    }
};

/* --- FILE MANAGEMENT FUNCTIONS --- */

export const fetchFiles = async (showAll = false) => {
    try {
        // Append query parameter if showAll is requested
        const url = showAll ? `${API_URL}/files?all=true` : `${API_URL}/files`;
        const response = await fetch(url, {
            method: 'GET',
            headers: await getAuthHeaders()
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
            headers: await getAuthHeaders(),
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
            headers: await getAuthHeaders()
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
            headers: await getAuthHeaders(),
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
            headers: await getAuthHeaders()
        });
        await handleResponse(response);
        return await response.json();
    } catch (error) {
        console.error("Search error:", error);
        return []; 
    }
};

/* --- PERMISSIONS MANAGEMENT --- */

export const addPermission = async (fileId, email, type) => {
    try {
        const response = await fetch(`${API_URL}/files/${fileId}/permissions`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ email, type })
        });

        await handleResponse(response);
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updatePermission = async (fileId, permissionId, newType) => {
    try {
        const response = await fetch(`${API_URL}/files/${fileId}/permissions/${permissionId}`, {
            method: 'PATCH',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ type: newType })
        });
        await handleResponse(response);
        return await response.json();
    } catch (error) { 
        throw error; 
    }
};

export const getPermissions = async (fileId) => {
    try {
        const response = await fetch(`${API_URL}/files/${fileId}/permissions`, {
            method: 'GET',
            headers: await getAuthHeaders()
        });
        await handleResponse(response);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch permissions", error);
        return [];
    }
};

export const removePermission = async (fileId, permissionId) => {
    try {
        const response = await fetch(`${API_URL}/files/${fileId}/permissions/${permissionId}`, {
            method: 'DELETE',
            headers: await getAuthHeaders()
        });
        
        /* 204 No Content signifies a successful deletion */
        if (response.status === 204) return true;

        await handleResponse(response);
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteFileApi = async (fileId) => {
    const response = await fetch(`${API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: await getAuthHeaders()
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete');
    }
    return true;
};