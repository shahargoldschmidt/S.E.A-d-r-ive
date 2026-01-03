/* client/src/services/api.js */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// helper function for header with token 
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '' 
    };
};

// --- Helper for consistent Error Handling & Auto-Logout ---
const handleResponse = async (response) => {
    if (!response.ok) {
        // אם הטוקן לא תקף או שאין הרשאות - ננתק את המשתמש
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login'; // העברה למסך ההתחברות
            throw new Error('Session expired. Please login again.');
        }

        // שגיאות אחרות (למשל ולידציה)
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Request failed');
    }
    return response;
};

// --- AUTH FUNCTIONS ---

// login 
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/tokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // בלוגין אנחנו מטפלים ידנית כי אין עדיין טוקן שיכול לפוג
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
        const idToFetch = userId || localStorage.getItem('userId');
        if (!idToFetch) return null;

        const response = await fetch(`${API_URL}/users/${idToFetch}`, {
            method: 'GET',
            headers: getAuthHeaders() 
        });

        // כאן נשתמש ב-handleResponse כדי לטפל בטוקן פג תוקף
        await handleResponse(response);

        return await response.json();
    } catch (error) {
        console.warn("Get User Error:", error);
        return null;
    }
};

// --- FILE FUNCTIONS (החלק החדש) ---

// 1. קבלת כל הקבצים (GET)
export const fetchFiles = async () => {
    try {
        const response = await fetch(`${API_URL}/files`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        // בדיקת שגיאות וטיפול ב-401/403
        await handleResponse(response); 
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// 2. יצירת קובץ או תיקייה (POST)
export const createFile = async (fileData) => {
    try {
        const response = await fetch(`${API_URL}/files`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(fileData)
        });

        // בדיקת שגיאות וטיפול ב-401/403
        await handleResponse(response);

        // השרת מחזיר 201 Created (לפעמים בלי גוף), אז נחזיר true
        return true;
    } catch (error) {
        throw error;
    }
};