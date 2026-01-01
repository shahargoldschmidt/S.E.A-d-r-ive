/* client/src/services/api.js */

const API_URL = "/api";

// helper function for header with token 
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '' 
    };
};

// login 
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
        
        // שמירת המידע בדפדפן לשימוש עתידי
        if (data.token) localStorage.setItem('token', data.token);
        if (data.userId) localStorage.setItem('userId', data.userId);
        
        return data; 
    } catch (error) {
        throw error;
    }
};

// --- הרשמה (Register) ---
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

// --- קבלת פרטי משתמש (Get User) ---
export const getUser = async (userId) => {
    try {
        // אם לא הועבר ID, ננסה לקחת מהזכרון
        const idToFetch = userId || localStorage.getItem('userId');

        if (!idToFetch) return null;

        const response = await fetch(`${API_URL}/users/${idToFetch}`, {
            method: 'GET',
            headers: getAuthHeaders() 
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
            }
            throw new Error('Failed to fetch user');
        }

        return await response.json();
    } catch (error) {
        console.warn(error);
        return null;
    }
};