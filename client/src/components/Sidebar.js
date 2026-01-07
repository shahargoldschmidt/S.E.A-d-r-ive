/* client/src/components/Sidebar.js */
import React, { useState, useRef } from 'react';
import { Icons } from '../utils/Icons'; 
import '../styles/sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onOpenFolderModal, onOpenTextFileModal, onUploadFile, onUploadPhoto }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    /* Refs to trigger hidden native file pickers */
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
        /* Clear input value to allow re-uploading the same file if needed */
        e.target.value = ''; 
    };

    return (
        <aside className="sidebar-container">
            {/* Hidden file inputs triggered via Ref */}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{display: 'none'}} 
                accept=".txt" 
                onChange={(e) => handleFileChange(e, 'file')} 
            />
            <input 
                type="file" 
                ref={photoInputRef} 
                accept="image/*" 
                style={{display: 'none'}} 
                onChange={(e) => handleFileChange(e, 'photo')} 
            />

            <div className="new-dive-wrapper">
                <button className="new-dive-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <Icons.Plus size={24} /> <span>New Dive</span>
                </button>

                {/* Create/Upload dropdown menu */}
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={() => { onOpenFolderModal(); setIsDropdownOpen(false); }}>
                            <Icons.Folder /> New Folder
                        </div>
                        
                        <div className="dropdown-item" onClick={() => { onOpenTextFileModal(); setIsDropdownOpen(false); }}>
                             <Icons.File /> New Text File
                        </div>

                        <div className="dropdown-item" onClick={() => { fileInputRef.current.click(); setIsDropdownOpen(false); }}>
                            <Icons.UploadFile /> Upload File
                        </div>

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