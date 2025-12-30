/* * client/src/pages/LoginPage.js
 * Handles user authentication (Login).
 * Uses styles from: client/src/styles/auth.css (Loaded globally via App.js)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const LoginPage = () => {
    // STATE: Store email and password inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // STATE: Store error messages from the server
    const [error, setError] = useState('');
    
    // HOOK: Used to redirect the user after login
    const navigate = useNavigate();

    // HANDLER: Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setError(''); // Clear previous errors

        try {
            // 1. Send credentials to the server
            const data = await loginUser(email, password);
            
            // 2. Save the received token to LocalStorage
            localStorage.setItem('token', data.token);
            
            // 3. Redirect user to the Dashboard
            navigate('/dashboard'); 
            
        } catch (err) {
            // Display error message (e.g., "Invalid email or password")
            setError(err.message);
        }
    };

    return (
        /* The main container card (Styled in auth.css) */
        <div className="glass-card">
            
            {/* Header Section: Logo and Title */}
            <div className="login-header">
                <div className="sea-logo">🌊</div>
                <h2 className="app-title">SeaDrive</h2>
                <p className="subtitle">Secure Storage. Deep Access.</p>
            </div>
                
            {/* Error Notification Bubble */}
            {error && <div className="error-bubble">{error}</div>}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
                <input 
                    className="sea-input"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    placeholder="Email Address"
                />
                
                <input 
                    className="sea-input"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="Password"
                />

                <button type="submit" className="btn-primary">Log In</button>
            </form>
            
            {/* Footer: Link to Registration */}
            <div className="auth-footer">
                New here? <span className="link-text" onClick={() => navigate('/register')}>Create an account</span>
            </div>
        </div>
    );
};

export default LoginPage;