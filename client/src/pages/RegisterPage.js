/* client/src/pages/RegisterPage.js */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import PasswordCriteria from '../components/PasswordCriteria'; 

const RegisterPage = ({ toggleTheme, isDarkMode }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', image: '' 
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false, upper: false, lower: false, number: false, special: false
    });
    const [passwordsMatch, setPasswordsMatch] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    
    const fileInputRef = useRef(null); // Ref לשליטה בבחירת הקובץ
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // פונקציה שמפעילה את בחירת הקובץ בלחיצה על העיגול
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // פונקציית עזר לקבלת האות הראשונה
    const getInitial = () => {
        if (formData.name && formData.name.trim() !== '') {
            return formData.name.trim().charAt(0).toUpperCase();
        }
        return "?";
    };

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
            const criteria = {
                length: value.length >= 8,
                upper: /[A-Z]/.test(value),
                lower: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            };
            setPasswordCriteria(criteria);
        }
    };

    return (
        <>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            <div className="glass-card">
                <h2 className="card-title">The Deep Sea Archive</h2>
                <p className="subtitle" style={{marginBottom: '20px'}}>Create your secure profile</p>
                
                {error && <div className="error-bubble">{error}</div>}
                
                <form onSubmit={(e) => { e.preventDefault(); registerUser(formData).then(() => navigate('/login')).catch(err => setError(err.message)); }}>
                    <div className="image-upload-wrapper">
                        {/* העיגול עצמו הוא כפתור הלחיצה */}
                        <div className="image-preview-circle clickable-circle" onClick={triggerFileInput} title="Click to upload">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" />
                            ) : (
                                /* תצוגת האות הראשונה אם אין תמונה */
                                <div className="letter-avatar">
                                    {getInitial()}
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                        <p style={{fontSize: '0.75rem', marginTop: '5px', opacity: 0.7}}>Click to add photo (Optional)</p>
                    </div>

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
                    
                    <button type="submit" className="btn-primary" disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.5 }}>
                        Create Account
                    </button>
                </form>
                
                <div className="auth-footer">
                    Already have an account? <span className="link-text" onClick={() => navigate('/login')}>Log In</span>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;