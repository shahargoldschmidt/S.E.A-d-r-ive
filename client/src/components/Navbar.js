/* client/src/components/Navbar.js */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = ({ toggleTheme, isDarkMode }) => {
    const user = { name: "Eliran Shmuel", image: "" }; 
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const renderAvatar = () => {
        if (user.image) return <img src={user.image} alt="Profile" className="nav-avatar-img" />;
        if (user.name) return <div className="nav-avatar-initial">{user.name.charAt(0).toUpperCase()}</div>;
        return <div className="nav-avatar-initial">⚓</div>;
    };

    return (
        <nav className="navbar-glass">
            {/* צד שמאל */}
            <div className="nav-left">
                <div className="nav-logo-container" onClick={() => navigate('/dashboard')}>
                    <span className="nav-logo-icon">🌊</span>
                    <span className="nav-logo-text">S.E.A. D(R)IVE</span>
                </div>
            </div>

            {/* אמצע */}
            <div className="nav-middle">
                <div className="search-bar-wrapper">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Search the depths..." className="search-input" />
                </div>
            </div>

            {/* צד ימין */}
            <div className="nav-right">
                <button className="nav-theme-toggle" onClick={toggleTheme}>
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                
                {/* מיכל האווטר */}
                <div style={{position: 'relative'}}>
                    <div 
                        className="nav-avatar-btn" 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        {renderAvatar()}
                    </div>

                    {showProfileMenu && (
                        <>
                            {/* 1. מסך שקוף לסגירת התפריט בלחיצה בחוץ */}
                            <div 
                                style={{
                                    position: 'fixed',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    zIndex: 999
                                }} 
                                onClick={() => setShowProfileMenu(false)}
                            />

                            {/* 2. התפריט עצמו */}
                            <div className="profile-dropdown">
                                <div style={{padding: '15px', borderBottom: '1px solid #eee', marginBottom:'5px', backgroundColor: isDarkMode ? '#2d3748' : '#f8f9fa'}}>
                                    <strong>{user.name}</strong>
                                    <div style={{fontSize: '12px', opacity: 0.7}}>eliran@sea.plus</div>
                                </div>
                                <div className="dropdown-item" onClick={() => setShowProfileMenu(false)}>Profile</div>
                                <div 
                                    className="dropdown-item" 
                                    style={{color:'#ff5252', borderTop: '1px solid #eee', marginTop: '5px'}} 
                                    onClick={() => navigate('/login')}
                                >
                                    Logout
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;