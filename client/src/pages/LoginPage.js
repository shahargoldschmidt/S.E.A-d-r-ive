import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        /* Authentication logic would go here, communicating with the server [cite: 66, 181] */
    };

    return (
        <div className="glass-card">
            <div className="login-header">
                {/* Branding matching the "Deep Sea Archive" vision */}
                <div className="sea-logo">🌊</div>
                <h2 className="app-title">SeaDrive</h2>
                <p className="subtitle">Secure Storage. Deep Access.</p>
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

                <button type="submit" className="btn-primary">Dive In</button>
            </form>
            
            <div className="auth-footer">
                New here? <span className="link-text" onClick={() => navigate('/register')}>Create an account</span>
            </div>
        </div>
    );
};

export default LoginPage;