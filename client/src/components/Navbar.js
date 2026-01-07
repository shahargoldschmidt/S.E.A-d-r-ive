/* client/src/components/Navbar.js */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFiles, getUser } from '../services/api'; 
import ProfileModal from './ProfileModal'; 
import { Icons } from '../utils/Icons'; 
import '../styles/navbar.css';
import AppLogo from '../assets/Logo.PNG';

const Navbar = ({ toggleTheme, isDarkMode, onFileClick }) => {
    const [user, setUser] = useState({ name: 'Guest', email: '', image: '' });
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    
    const searchRef = useRef(null);

    
    useEffect(() => {
        const fetchUserData = async () => {
            const userId = sessionStorage.getItem('userId');
            if (userId) {
                try {
                    const userData = await getUser(userId);
                    if (userData) setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                }
            }
        };
        fetchUserData();
    }, []);

    
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 0) {
                setIsSearching(true);
                setShowSearchDropdown(true);
                try {
                    const data = await searchFiles(query);
                    setResults(data);
                } catch (error) { console.error("Search error", error); } 
                finally { setIsSearching(false); }
            } else {
                setResults([]);
                setShowSearchDropdown(false);
            }
        }, 400); 
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        navigate('/login');
    };

    const renderAvatar = () => {
        if (user.image) return <img src={user.image} alt="Profile" className="nav-avatar-img" />;
        if (user.name && user.name !== 'Guest') return <div className="nav-avatar-initial">{user.name.charAt(0).toUpperCase()}</div>;
        return <div className="nav-avatar-initial"><Icons.User /></div>;
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('he-IL');
    const formatSize = (bytes) => bytes ? (bytes/1024).toFixed(1) + ' KB' : '';


    const getFileIcon = (type) => {
        if (type === 'folder') return <Icons.Folder size={18} color="#ffb703" />; 
        if (type === 'image') return <Icons.Image size={18} color="#4facfe" />;
        return <Icons.FileText size={18} color="#64748b" />;
    };

    return (
        <>
            <nav className="navbar-glass">
                <div className="nav-left">
                    <div className="nav-logo-container" >
                        <img src={AppLogo} alt="Logo" className="nav-logo-img" />
                        <span className="nav-logo-text">S.E.A. D(R)IVE</span>
                    </div>
                </div>

                <div className="nav-middle" ref={searchRef}>
                    <div className="search-bar-wrapper">
                         <span className="search-icon">
                             <Icons.Search size={22} />
                         </span>
                         <input 
                            type="text" 
                            placeholder="search the depths..." 
                            className="search-input" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => query.length > 0 && setShowSearchDropdown(true)}
                        />

                        {showSearchDropdown && (
                            <div className="search-dropdown">
                                {isSearching && (
                                    <div style={{padding:'15px', textAlign:'center', color:'#888', fontSize:'0.9rem'}}>
                                        Scanning... 🔭
                                    </div>
                                )}
                                {!isSearching && results.length === 0 && (
                                    <div style={{padding:'15px', textAlign:'center', color:'#888', fontSize:'0.9rem'}}>
                                        No treasures found 🦀
                                    </div>
                                )}

                                {!isSearching && results.map(file => (
                                    <div key={file.id} className="search-result-item" onClick={() => { if (onFileClick) onFileClick(file); setShowSearchDropdown(false); setQuery(''); }}>
                                        <div className="result-icon">
                                            {getFileIcon(file.type)}
                                        </div>
                                        <div className="result-info" style={{flex: 1}}>
                                            <div className="result-name">{file.name}</div>
                                            <div className="result-meta" style={{fontSize:'0.75rem', opacity: 0.7}}>{formatDate(file.createdAt)} • {file.owner || 'Me'}</div>
                                        </div>
                                        <div style={{fontSize:'0.75rem', opacity: 0.6}}>{formatSize(file.size)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="nav-right">
                    <button className="nav-theme-toggle" onClick={toggleTheme}>
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    
                    <div style={{position: 'relative'}}>
                        <div className="nav-avatar-btn" onClick={() => setShowProfileMenu(!showProfileMenu)} title={user.name}>
                            {renderAvatar()}
                        </div>
                        
                        {showProfileMenu && (
                            <>
                                <div style={{position: 'fixed', inset: 0, zIndex: 2999}} onClick={() => setShowProfileMenu(false)} />
                                <div className="profile-dropdown">
                                    <div className="profile-header-dropdown">
                                        <strong style={{fontSize: '20px'}}>{user.name}</strong>
                                        <div style={{fontSize: '15px', opacity: 0.7}}>{user.email}</div>
                                    </div>
                                    
                                    <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}>
                                        <Icons.User size={18} /> <span>My Profile</span>
                                    </div>
                                    
                                    <div className="dropdown-item logout-item" onClick={handleLogout}>
                                        <Icons.Logout size={18} /> <span>Logout</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            {showProfileModal && <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />}
        </>
    );
};

export default Navbar;