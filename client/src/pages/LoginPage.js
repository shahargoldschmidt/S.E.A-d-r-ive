/* client/src/pages/LoginPage.js */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api'; 
import AppLogo from '../assets/Logo.PNG';


const LoginPage = ({ toggleTheme, isDarkMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await loginUser(email, password);
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.message); 
        } finally {
            setIsLoading(false); 
        }
    };

   return (
    <>
        <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title="Switch Theme"
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>

        <div className="glass-card">
            <div className="login-header">
                <img src={AppLogo} alt="Logo" className="nav-logo-img" />
                <h2 className="app-title">S.E.A. D(R)IVE</h2>
                <p className="subtitle">Sail to Success</p>
            </div>
                
            {error && <div className="error-bubble">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <input 
                    className="sea-input"
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    placeholder="Email Address"
                />
                
                <input 
                    className="sea-input"
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="Password"
                />

                <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? 'Connecting...' : 'Dive In'}
                </button>
            </form>
            
            <div className="auth-footer">
                Don't have an account? <span className="link-text" onClick={() => navigate('/register')}>Register</span>
            </div>
        </div>
    </>
);
};

export default LoginPage;