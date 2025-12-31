/* client/src/pages/RegisterPage.js */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import PasswordCriteria from '../components/PasswordCriteria'; 

const RegisterPage = ({ toggleTheme, isDarkMode }) => {
    // ... (אותו State ולוגיקה כמו קודם - לא השתנה)
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', image: '' 
    });
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false, upper: false, lower: false, number: false, special: false
    });
    const [passwordsMatch, setPasswordsMatch] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validatePassword = (value) => {
        const criteria = {
            length: value.length >= 8,
            upper: /[A-Z]/.test(value),
            lower: /[a-z]/.test(value),
            number: /[0-9]/.test(value),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
        };
        setPasswordCriteria(criteria);
        return criteria;
    };

    useEffect(() => {
        const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
        const match = formData.password === formData.confirmPassword && formData.password !== '';
        if (formData.confirmPassword) setPasswordsMatch(match);
        setIsFormValid(allCriteriaMet && match);
    }, [formData, passwordCriteria]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'password') validatePassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        try {
            await registerUser(formData);
            alert("Registration successful! Please log in.");
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="glass-card">
            {/* --- Toggle Button --- */}
            <button 
                className="theme-toggle-btn" 
                onClick={toggleTheme} 
                title="Switch Theme"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            <h2>Create Account</h2>
            <p className="subtitle" style={{marginBottom: '20px'}}>Join the Crew</p>
            
            {error && <div className="error-bubble">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <input className="sea-input" name="name" type="text" onChange={handleChange} required placeholder="Full Name" />
                <input className="sea-input" name="email" type="email" onChange={handleChange} required placeholder="Email Address" />
                
                <input 
                    className="sea-input" name="password" type="password" onChange={handleChange} required placeholder="Password"
                    style={{ borderColor: formData.password && !Object.values(passwordCriteria).every(Boolean) ? '#ff5252' : 'transparent', borderWidth: '2px', borderStyle: 'solid' }}
                />

                {formData.password && <PasswordCriteria criteria={passwordCriteria} />}

                <input 
                    className="sea-input" name="confirmPassword" type="password" onChange={handleChange} required placeholder="Confirm Password"
                    style={{ borderColor: passwordsMatch === false ? '#ff5252' : (passwordsMatch === true ? '#2e7d32' : 'transparent'), borderWidth: '2px', borderStyle: 'solid' }}
                />
                
                <button type="submit" className="btn-primary" disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }}>
                    Sign Up
                </button>
            </form>
            
            <div className="auth-footer">
                Already have an account? <span className="link-text" onClick={() => navigate('/login')}>Log In</span>
            </div>
        </div>
    );
};

export default RegisterPage;