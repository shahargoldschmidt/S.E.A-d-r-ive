import React, { useState } from 'react';

import '../styles/sidebar.css';

// אייקונים (השארתי את מה שהיה לך והוספתי לתיקייה וקובץ)
const Icons = {
    Home: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>),
    Starred: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>),
    Shared: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>),
    Trash: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>),
    Plus: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>),
    Folder: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>),
    File: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>)
};

const Sidebar = ({ activeTab, setActiveTab, onOpenFolderModal, onOpenFileModal }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const menuItems = [
        { id: 'My Drive', icon: <Icons.Home />, label: 'Home' },
        { id: 'Starred', icon: <Icons.Starred />, label: 'Starred' },
        { id: 'Shared', icon: <Icons.Shared />, label: 'Shared with me' },
        { id: 'Trash', icon: <Icons.Trash />, label: 'Trash' }
    ];

    const handleAction = (action) => {
        action();
        setIsDropdownOpen(false); // סגור תפריט אחרי לחיצה
    };

    return (
        <aside className="sidebar-container">
            {/* כפתור הוספה עם תפריט נפתח */}
            <div className="new-dive-wrapper">
                <button 
                    className="new-dive-btn" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span style={{display:'flex', width:'24px'}}><Icons.Plus /></span>
                    <span>New Dive</span>
                </button>

                {/* התפריט הקופץ - מופיע רק אם הסטייט אמת */}
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={() => handleAction(onOpenFolderModal)}>
                            <Icons.Folder /> Add Folder
                        </button>
                        <button className="dropdown-item" onClick={() => handleAction(onOpenFileModal)}>
                            <Icons.File /> Add File
                        </button>
                    </div>
                )}
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <div 
                        key={item.id}
                        className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;