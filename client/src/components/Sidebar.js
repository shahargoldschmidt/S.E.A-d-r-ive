/* client/src/components/Sidebar.js */
import React, { useState, useRef } from 'react';
import { Icons } from '../utils/Icons'; // The new centralized icon source
import '../styles/sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onOpenFolderModal, onOpenTextFileModal, onUploadFile, onUploadPhoto }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Refs for hidden file inputs
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
        e.target.value = ''; // Reset input so the same file can be selected again if needed
    };

    return (
        <aside className="sidebar-container">
            {/* Hidden inputs for file/photo upload */}
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

            {/* Main "New Dive" Button */}
            <div className="new-dive-wrapper">
                <button className="new-dive-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <Icons.Plus size={24} /> <span>New Dive</span>
                </button>

                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        {/* 1. Create New Folder */}
                        <div className="dropdown-item" onClick={() => { onOpenFolderModal(); setIsDropdownOpen(false); }}>
                            <Icons.Folder /> New Folder
                        </div>
                        
                        {/* 2. Create New Text File */}
                        <div className="dropdown-item" onClick={() => { onOpenTextFileModal(); setIsDropdownOpen(false); }}>
                             <Icons.File /> New Text File
                        </div>

                        {/* 3. Upload Existing File */}
                        <div className="dropdown-item" onClick={() => { fileInputRef.current.click(); setIsDropdownOpen(false); }}>
                            <Icons.UploadFile /> Upload File
                        </div>

                        {/* 4. Upload Photo */}
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