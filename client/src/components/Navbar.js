/* client/src/components/Navbar.js */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFiles, getUser } from '../services/api'; 
import ProfileModal from './ProfileModal'; 
import '../styles/navbar.css';

const Navbar = ({ toggleTheme, isDarkMode, onFileClick }) => {
    // --- User State ---
    const [user, setUser] = useState({ name: 'Guest', email: '', image: '' });
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();

    // --- Search State ---
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    
    // Ref לסגירת החיפוש בלחיצה בחוץ
    const searchRef = useRef(null);

    // --- 1. טעינת פרטי המשתמש בעליית הרכיב (הקוד של החברה) ---
    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const userData = await getUser(userId);
                    if (userData) {
                        setUser(userData);
                    }
                } catch (error) {
                    console.error("Failed to fetch user data for Navbar", error);
                    // במקרה של כישלון (למשל טוקן פג תוקף) אפשר לנתק את המשתמש
                    // handleLogout(); // אופציונלי
                }
            }
        };
        fetchUserData();
    }, []);

    // --- 2. לוגיקת חיפוש חכם (Debounce) ---
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 1) {
                setIsSearching(true);
                setShowSearchDropdown(true);
                try {
                    const data = await searchFiles(query);
                    setResults(data);
                } catch (error) {
                    console.error("Search error", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setShowSearchDropdown(false);
            }
        }, 400); // המתנה של 400ms

        return () => clearTimeout(timer);
    }, [query]);

    // --- 3. סגירת חיפוש בלחיצה בחוץ ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- פונקציות עזר ---
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const renderAvatar = () => {
        if (user.image) return <img src={user.image} alt="Profile" className="nav-avatar-img" />;
        // בדיקה שהשם קיים ואינו 'Guest' כדי להציג אות
        if (user.name && user.name !== 'Guest') return <div className="nav-avatar-initial">{user.name.charAt(0).toUpperCase()}</div>;
        return <div className="nav-avatar-initial">⚓</div>;
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('he-IL');
    const formatSize = (bytes) => bytes ? (bytes/1024).toFixed(1) + ' KB' : '';

    return (
        <>
            <nav className="navbar-glass">
                {/* צד שמאל - לוגו */}
                <div className="nav-left">
                    <div className="nav-logo-container" onClick={() => navigate('/dashboard')}>
                        <span className="nav-logo-icon">🌊</span>
                        <span className="nav-logo-text">S.E.A. D(R)IVE</span>
                    </div>
                </div>

                {/* אמצע - חיפוש (הגרסה המתקדמת) */}
                <div className="nav-middle" ref={searchRef}>
                    <div className="search-bar-wrapper">
                         <span className="search-icon">🔍</span>
                         <input 
                            type="text" 
                            placeholder="Dive for files..." 
                            className="search-input" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => query.length > 1 && setShowSearchDropdown(true)}
                        />

                        {/* Dropdown תוצאות */}
                        {showSearchDropdown && (
                            <div className="search-dropdown">
                                {isSearching && <div style={{padding:'15px', textAlign:'center', color:'#888', fontSize:'0.9rem'}}>Scanning... 🔭</div>}
                                
                                {!isSearching && results.length === 0 && (
                                    <div style={{padding:'15px', textAlign:'center', color:'#888', fontSize:'0.9rem'}}>No treasures found 🦀</div>
                                )}

                                {!isSearching && results.map(file => (
                                    <div 
                                        key={file.id} 
                                        className="search-result-item"
                                        onClick={() => {
                                            if (onFileClick) onFileClick(file);
                                            setShowSearchDropdown(false);
                                            setQuery('');
                                        }}
                                    >
                                        <div className="result-icon" style={{fontSize: '1.2rem'}}>
                                            {file.type === 'folder' ? '📁' : file.type === 'image' ? '🖼️' : '📄'}
                                        </div>
                                        <div className="result-info" style={{flex: 1}}>
                                            <div className="result-name">{file.name}</div>
                                            <div className="result-meta" style={{fontSize:'0.75rem', opacity: 0.7}}>
                                                {formatDate(file.createdAt)} • {file.owner || 'Me'}
                                            </div>
                                        </div>
                                        <div style={{fontSize:'0.75rem', opacity: 0.6}}>
                                            {formatSize(file.size)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* צד ימין - פרופיל (הגרסה המעוצבת) */}
                <div className="nav-right">
                    <button className="nav-theme-toggle" onClick={toggleTheme}>
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    
                    <div style={{position: 'relative'}}>
                        <div 
                            className="nav-avatar-btn" 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            title={user.name}
                        >
                            {renderAvatar()}
                        </div>

                        {showProfileMenu && (
                            <>
                                {/* שכבת מגן לסגירה בלחיצה בחוץ */}
                                <div 
                                    style={{position: 'fixed', inset: 0, zIndex: 2999}} 
                                    onClick={() => setShowProfileMenu(false)}
                                />

                                <div className="profile-dropdown">
                                    <div className="profile-header-dropdown">
                                        <strong>{user.name}</strong>
                                        <div style={{fontSize: '12px', opacity: 0.7}}>{user.email}</div>
                                    </div>
                                    
                                    {/* כפתור לפתיחת המודל */}
                                    <div className="dropdown-item" onClick={() => {
                                        setShowProfileMenu(false);
                                        setShowProfileModal(true); 
                                    }}>
                                        <span>👤</span> My Profile
                                    </div>

                                    {/* כפתור התנתקות מעוצב */}
                                    <div 
                                        className="dropdown-item logout-item" 
                                        onClick={handleLogout}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        Logout
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* המודל (Pop-up) שמציג פרטים */}
            {showProfileModal && (
                <ProfileModal 
                    user={user}
                    onClose={() => setShowProfileModal(false)}
                />
            )}
        </>
    );
};

export default Navbar;