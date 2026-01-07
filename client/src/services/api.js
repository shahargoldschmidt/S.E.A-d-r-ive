/* client/src/services/api.js */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

/* Helper function to generate authorization headers using the stored session token */
const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
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
        
        /* Store authentication data in sessionStorage for session persistence */
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

/* --- FILE MANAGEMENT FUNCTIONS --- */

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

/* --- PERMISSIONS MANAGEMENT --- */

export const addPermission = async (fileId, email, type) => {
    try {
        const response = await fetch(`${API_URL}/files/${fileId}/permissions`, {
            method: 'POST',
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders()
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
            headers: getAuthHeaders()
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
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete');
    }
    return true;
};