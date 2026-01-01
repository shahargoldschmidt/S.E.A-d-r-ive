/* client/src/components/Navbar.js */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Navbar = ({ toggleTheme, isDarkMode }) => {
    // נתונים סטטיים (בהמשך יגיעו מ-Context)
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
            {/* צד שמאל: לוגו ושם מתוקן */}
            <div className="nav-left">
                <div className="nav-logo-container" onClick={() => navigate('/dashboard')}>
                    <span className="nav-logo-icon">🌊</span>
                    {/* השם המקורי והנכון */}
                    <span className="nav-logo-text">S.E.A. D(R)IVE</span>
                </div>
            </div>

            {/* אמצע: חיפוש רחב */}
            <div className="nav-middle">
                <div className="search-bar-wrapper">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search the depths..." 
                        className="search-input" 
                    />
                </div>
            </div>

            {/* צד ימין */}
            <div className="nav-right">
                <button 
                    className="nav-theme-toggle" 
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                
                <div style={{position: 'relative'}}>
                    <div 
                        className="nav-avatar-btn" 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        {renderAvatar()}
                    </div>

                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            <div style={{padding: '10px', borderBottom: '1px solid #ccc', marginBottom:'5px'}}>
                                <strong>{user.name}</strong>
                            </div>
                            <div className="dropdown-item">Profile</div>
                            <div className="dropdown-item" style={{color:'#ff5252'}} onClick={() => navigate('/login')}>Logout</div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;