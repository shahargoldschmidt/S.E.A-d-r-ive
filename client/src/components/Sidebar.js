import React, { useState, useRef } from 'react';
import '../styles/sidebar.css';

const Icons = {
    Home: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>),
    Storage: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.81 4.43l.59 1.62 1.72.19C21.38 12.39 22 13.12 22 14c0 1.66-1.34 3-3 3z"/></svg>),
    Starred: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>),
    Shared: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>),
    Trash: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>),
    Plus: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>),
    Folder: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>),
    File: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>),
    UploadFile: () => (<svg className="menu-icon-svg" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" /></svg>),
    UploadPhoto: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>)
};

const Sidebar = ({ activeTab, setActiveTab, onOpenFolderModal, onOpenTextFileModal, onUploadFile, onUploadPhoto }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // רפרנסים לאינפוטים הנסתרים
    const fileInputRef = useRef(null);
    const photoInputRef = useRef(null);

    const menuItems = [
        { id: 'Home', icon: <Icons.Home />, label: 'Home' },
        { id: 'My Storage', icon: <Icons.Storage />, label: 'My Storage' },
        { id: 'Shared With Me', icon: <Icons.Shared />, label: 'Shared With Me' },
        { id: 'Starred', icon: <Icons.Starred />, label: 'Starred' },
        { id: 'Trash', icon: <Icons.Trash />, label: 'Trash' }
    ];

    const handleFileChange = (e, type) => {
        if (e.target.files[0]) {
            if (type === 'photo') onUploadPhoto(e.target.files[0]);
            else onUploadFile(e.target.files[0]);
        }
        setIsDropdownOpen(false);
        e.target.value = ''; // איפוס כדי שאפשר יהיה להעלות שוב
    };

    return (
        <aside className="sidebar-container">
            {/* אינפוטים נסתרים להעלאה */}
            <input type="file" ref={fileInputRef} style={{display: 'none'}} accept=".txt" onChange={(e) => handleFileChange(e, 'file')} />
            <input type="file" ref={photoInputRef} accept="image/*" style={{display: 'none'}} onChange={(e) => handleFileChange(e, 'photo')} />

            {/* כפתור הוספה ראשי */}
            <div className="new-dive-wrapper">
                <button className="new-dive-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <Icons.Plus /> <span>New Dive</span>
                </button>

                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        {/* 1. יצירת תיקייה */}
                        <div className="dropdown-item" onClick={() => { onOpenFolderModal(); setIsDropdownOpen(false); }}>
                            <Icons.Folder /> New Folder
                        </div>
                        
                        {/* 2. יצירת קובץ טקסט חדש */}
                        <div className="dropdown-item" onClick={() => { onOpenTextFileModal(); setIsDropdownOpen(false); }}>
                             <Icons.File /> New Text File
                        </div>

                        {/* 3. העלאת קובץ קיים */}
                        <div className="dropdown-item" onClick={() => { fileInputRef.current.click(); setIsDropdownOpen(false); }}>
                            <Icons.UploadFile /> Upload File
                        </div>

                        {/* 4. העלאת תמונה */}
                        <div className="dropdown-item" onClick={() => { photoInputRef.current.click(); setIsDropdownOpen(false); }}>
                            <Icons.UploadPhoto /> Upload Photo
                        </div>
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