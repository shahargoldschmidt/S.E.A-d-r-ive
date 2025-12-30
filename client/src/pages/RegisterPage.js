/* client/src/pages/RegisterPage.js
 * Cleaned version: Logic remains here, but UI is split into components.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import PasswordCriteria from '../components/PasswordCriteria'; // Import the new component

const RegisterPage = () => {
    // STATE: Form Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: '' 
    });
    
    // STATE: Password Rules Status
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false, upper: false, lower: false, number: false, special: false
    });

    const [passwordsMatch, setPasswordsMatch] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // LOGIC: Validate password structure
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

    // EFFECT: Check overall validity
    useEffect(() => {
        const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
        const match = formData.password === formData.confirmPassword && formData.password !== '';
        
        if (formData.confirmPassword) setPasswordsMatch(match);
        setIsFormValid(allCriteriaMet && match);
    }, [formData, passwordCriteria]);

    // HANDLER: Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            validatePassword(value);
            if (formData.confirmPassword) setPasswordsMatch(value === formData.confirmPassword);
        }
        if (name === 'confirmPassword') {
            setPasswordsMatch(formData.password === value);
        }
    };

    // HANDLER: Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                image: formData.image
            });
            alert("Registration successful! Please log in.");
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="glass-card">
            <h2>Create Account</h2>
            <p className="subtitle" style={{marginBottom: '20px'}}>Join the depth.</p>
            
            {error && <div className="error-bubble">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                {/* Avatar Placeholder */}
                <div className="avatar-section">
                    <div className="avatar-preview"><span className="camera-icon">📷</span></div>
                    <span className="upload-label">Upload Photo</span>
                </div>

                <input className="sea-input" name="name" type="text" onChange={handleChange} required placeholder="Full Name" />
                <input className="sea-input" name="email" type="email" onChange={handleChange} required placeholder="Email Address" />
                
                {/* Password Input */}
                <input 
                    className="sea-input" 
                    name="password" 
                    type="password" 
                    onChange={handleChange} 
                    required 
                    placeholder="Password"
                    style={{ borderColor: formData.password && !Object.values(passwordCriteria).every(Boolean) ? '#ff5252' : 'transparent' }}
                />

                {/* --- CLEANER UI: Using the sub-component --- */}
                {formData.password && (
                    <PasswordCriteria criteria={passwordCriteria} />
                )}

                {/* Confirm Password Input */}
                <input 
                    className="sea-input" 
                    name="confirmPassword" 
                    type="password" 
                    onChange={handleChange} 
                    required 
                    placeholder="Confirm Password"
                    style={{ borderColor: passwordsMatch === false ? '#ff5252' : (passwordsMatch === true ? '#2e7d32' : 'transparent') }}
                />
                
                {/* Match Status Text */}
                {passwordsMatch === false && <div style={{color: '#ff5252', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px', textAlign: 'left', paddingLeft: '10px'}}>Passwords do not match</div>}
                {passwordsMatch === true && <div style={{color: '#2e7d32', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px', textAlign: 'left', paddingLeft: '10px'}}>Passwords match! ✔</div>}

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