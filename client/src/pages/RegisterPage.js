/* client/src/pages/RegisterPage.js */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import PasswordCriteria from '../components/PasswordCriteria';
import '../styles/auth.css';

const RegisterPage = ({ toggleTheme, isDarkMode }) => {
    // ... (כל הסטייטים והלוגיקה נשארים אותו דבר בדיוק) ...
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', image: '' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // --- שאר המשתנים והפונקציות שלך (handleImageChange וכו') נשארים אותו דבר ---
    const [imagePreview, setImagePreview] = useState(null);
    const [passwordCriteria, setPasswordCriteria] = useState({ length: false, upper: false, lower: false, number: false, special: false });
    const [passwordsMatch, setPasswordsMatch] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null); 
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveImage = (e) => { e.stopPropagation(); setImagePreview(null); setFormData(prev => ({ ...prev, image: '' })); if (fileInputRef.current) fileInputRef.current.value = ""; };
    const triggerFileInput = () => fileInputRef.current.click();
    const getInitial = () => { if (formData.name && formData.name.trim() !== '') return formData.name.trim().charAt(0).toUpperCase(); return "👤"; };
    useEffect(() => {
        const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
        const match = formData.password === formData.confirmPassword && formData.password !== '';
        if (formData.confirmPassword) setPasswordsMatch(match);
        setIsFormValid(allCriteriaMet && match && formData.name && formData.email);
    }, [formData, passwordCriteria]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'password') {
            setPasswordCriteria({
                length: value.length >= 8, upper: /[A-Z]/.test(value), lower: /[a-z]/.test(value), number: /[0-9]/.test(value), special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            });
        }
    };

    // === אייקונים (SVG) ===
    // עין פתוחה
    const EyeOffIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    );
    // עין סגורה (עם קו)
    const EyeIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    );

    return (
        <div className="auth-container"> 
            <button className="theme-toggle-btn" onClick={toggleTheme}> {isDarkMode ? '☀️' : '🌙'} </button>

            <div className="glass-card">
                <h2 className="app-title" style={{fontSize: '1.5rem', marginBottom: '5px'}}>Join The Crew</h2>
                <p className="subtitle" style={{marginBottom: '20px'}}>Create your secure profile</p>
                {error && <div className="error-bubble">{error}</div>}
                
                <form onSubmit={(e) => { e.preventDefault(); registerUser(formData).then(() => navigate('/login')).catch(err => setError(err.message)); }}>
                    
                    <div className="image-upload-wrapper">
                        <div className="image-preview-circle clickable-circle" onClick={triggerFileInput}>
                            {imagePreview ? <img src={imagePreview} alt="Profile" /> : <div className="letter-avatar">{getInitial()}</div>}
                        </div>
                        {imagePreview && <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>✕</button>}
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                        <p style={{fontSize: '0.75rem', marginTop: '5px', opacity: 0.7}}>Click to add photo</p>
                    </div>

                    <input className="sea-input" name="name" type="text" onChange={handleChange} required placeholder="Full Name" />
                    <input className="sea-input" name="email" type="email" onChange={handleChange} required placeholder="Email Address" />
                    
                    {/* --- סיסמה עם אייקון SVG --- */}
                    <div className="password-wrapper">
                        <input 
                            className="sea-input" name="password" 
                            type={showPassword ? "text" : "password"} 
                            onChange={handleChange} required placeholder="Password"
                            style={{ borderColor: formData.password && !Object.values(passwordCriteria).every(Boolean) ? '#ff5252' : 'transparent', borderWidth: '2px', borderStyle: 'solid' }}
                        />
                        <button type="button" className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? EyeOffIcon : EyeIcon}
                        </button>
                    </div>

                    {formData.password && <PasswordCriteria criteria={passwordCriteria} />}

                    {/* --- אימות סיסמה עם אייקון SVG --- */}
                    <div className="password-wrapper">
                        <input 
                            className="sea-input" name="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"} 
                            onChange={handleChange} required placeholder="Confirm Password"
                            style={{ borderColor: passwordsMatch === false ? '#ff5252' : (passwordsMatch === true ? '#2e7d32' : 'transparent'), borderWidth: '2px', borderStyle: 'solid' }}
                        />
                        <button type="button" className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? EyeOffIcon : EyeIcon}
                        </button>
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.5 }}>Create Account</button>
                </form>
                
                <div className="auth-footer">Already have an account? <span className="link-text" onClick={() => navigate('/login')}>Log In</span></div>
            </div>
        </div>
    );
};
export default RegisterPage;