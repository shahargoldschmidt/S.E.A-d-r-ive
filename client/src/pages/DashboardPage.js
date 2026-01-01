/* client/src/pages/DashboardPage.js */
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreateFolderModal from '../components/CreateFolderModal'; 
import CreateFileModal from '../components/CreateFileModal'; 
import { fetchFiles, createFile } from '../services/api'; 
import '../styles/layout.css';

const DashboardPage = ({ toggleTheme, isDarkMode }) => {
    const [activeTab, setActiveTab] = useState('My Drive');
    const [files, setFiles] = useState([]); 
    const [activeModal, setActiveModal] = useState(null); 
    
    // ניהול רשימת הכוכבים (Local Storage)
    const [starredIds, setStarredIds] = useState(() => {
        const saved = localStorage.getItem('starredFiles');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    const loadFiles = async () => {
        try {
            const data = await fetchFiles();
            setFiles(data);
        } catch (error) {
            console.error("Failed to load files", error);
        }
    };

    useEffect(() => { loadFiles(); }, []);

    useEffect(() => {
        localStorage.setItem('starredFiles', JSON.stringify([...starredIds]));
    }, [starredIds]);

    const handleToggleStar = (fileId) => {
        setStarredIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(fileId)) newSet.delete(fileId);
            else newSet.add(fileId);
            return newSet;
        });
    };

    const getFilteredFiles = () => {
        if (activeTab === 'Starred') {
            return files.filter(file => starredIds.has(file.id));
        }
        return files; 
    };

    const displayFiles = getFilteredFiles();

    // --- הפונקציות הקיימות ליצירה והעלאה ---
    const handleCreateFolder = async (folderName) => {
        try {
            await createFile({ name: folderName, type: 'folder', parentId: null });
            setActiveModal(null);
            loadFiles();
        } catch (error) { alert("Error: " + error.message); }
    };

    const handleCreateTextFile = async (fileName, content) => {
        try {
            await createFile({ name: fileName, type: 'file', parentId: null, content: content });
            setActiveModal(null);
            loadFiles();
        } catch (error) { alert("Error: " + error.message); }
    };

    const handleUpload = async (fileObj) => {
        if (!fileObj) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                await createFile({
                    name: fileObj.name,
                    type: fileObj.type.startsWith('image/') ? 'image' : 'file',
                    parentId: null,
                    content: e.target.result 
                });
                loadFiles();
            } catch (error) { alert("Upload failed: " + error.message); }
        };
        reader.readAsText(fileObj); 
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('he-IL');
    const formatSize = (bytes) => bytes ? `${(bytes/1024).toFixed(1)} KB` : '-';

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            
            <div className="dashboard-body">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                    onOpenFolderModal={() => setActiveModal('folder')}
                    onOpenTextFileModal={() => setActiveModal('textFile')}
                    onUploadFile={(file) => handleUpload(file)}
                    onUploadPhoto={(file) => handleUpload(file)}
                />
                
                <main className="main-content">
                    <h2 className="content-title">{activeTab}</h2>
                    
                    <div className="files-table-container">
                        <table className="files-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Owner</th>
                                    <th>Date</th>
                                    <th>Size</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayFiles.map(file => {
                                    const isStarred = starredIds.has(file.id);
                                    
                                    return (
                                        <tr key={file.id}>
                                            <td className="file-name-cell">
                                                <span className="file-icon">
                                                    {file.type === 'folder' ? '📁' : file.type === 'image' ? '🖼️' : '📄'}
                                                </span>
                                                {file.name}
                                            </td>
                                            <td>{file.owner || 'Me'}</td>
                                            <td>{formatDate(file.createdAt)}</td>
                                            <td>{formatSize(file.size)}</td>
                                            
                                            <td className="actions-cell">
                                                {/* כפתור הכוכב המעודכן */}
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleStar(file.id);
                                                    }}
                                                    className="action-btn"
                                                    title={isStarred ? "Remove from Starred" : "Add to Starred"}
                                                    // עיצוב ישיר כדי להבטיח עיגול מושלם ומרכוז
                                                    style={{
                                                        width: '40px', 
                                                        height: '40px', 
                                                        borderRadius: '50%', 
                                                        padding: 0, 
                                                        display: 'inline-flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {isStarred ? (
                                                        <span style={{color: '#f4b400', fontSize: '1.7rem', marginTop: '-4px'}}>★</span>
                                                    ) : (
                                                        <span style={{color: '#ccc', fontSize: '1.7rem', marginTop: '-4px'}}>☆</span>
                                                    )}
                                                </button>

                                                <button className="action-btn edit" title="Edit">✏️</button>
                                                <button className="action-btn perm" title="Permissions">🔒</button>
                                                <button className="action-btn delete" title="Delete" style={{color:'red'}}>🗑️</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        {displayFiles.length === 0 && (
                            <div style={{textAlign:'center', padding:'50px', opacity:0.6}}>
                                {activeTab === 'Starred' ? "No starred files yet ⭐" : "Empty folder"}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <CreateFolderModal 
                isOpen={activeModal === 'folder'}
                onClose={() => setActiveModal(null)}
                onCreate={handleCreateFolder}
            />
            <CreateFileModal 
                isOpen={activeModal === 'textFile'}
                onClose={() => setActiveModal(null)}
                onCreate={handleCreateTextFile}
            />
        </div>
    );
};

export default DashboardPage;