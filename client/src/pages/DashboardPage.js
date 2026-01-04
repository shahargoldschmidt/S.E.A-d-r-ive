/* client/src/pages/DashboardPage.js */
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreateFolderModal from '../components/CreateFolderModal'; 
import CreateFileModal from '../components/CreateFileModal'; 
import FileEditor from '../components/FileEditor'; 
import { fetchFiles, createFile, getFileById, updateFile, getUser } from '../services/api'; // הוספנו את getUser
import '../styles/layout.css';

const DashboardPage = ({ toggleTheme, isDarkMode }) => {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('My Drive');
    const [files, setFiles] = useState([]); 
    const [activeModal, setActiveModal] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    
    // --- משתנה חדש: פרטי המשתמש הנוכחי (כולל שם) ---
    const [currentUser, setCurrentUser] = useState(null);

    const fileInputRef = useRef(null);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [folderStack, setFolderStack] = useState([]);

    const [starredIds, setStarredIds] = useState(() => {
        const saved = localStorage.getItem('starredFiles');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [trashedIds, setTrashedIds] = useState(() => {
        const saved = localStorage.getItem('trashedFiles');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => { localStorage.setItem('starredFiles', JSON.stringify([...starredIds])); }, [starredIds]);
    useEffect(() => { localStorage.setItem('trashedFiles', JSON.stringify([...trashedIds])); }, [trashedIds]);

    // --- טעינת המשתמש הנוכחי (התיקון החשוב) ---
    useEffect(() => {
        const loadUser = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const userData = await getUser(userId);
                    setCurrentUser(userData); // שומרים את האובייקט המלא עם השם
                } catch (e) {
                    console.error("Failed to load user", e);
                }
            }
        };
        loadUser();
    }, []);

    // --- טעינת קבצים ---
    const loadFiles = async () => {
        if (selectedFile) return; 
        setFiles([]); 
        try {
            if (currentFolder) {
                const folderData = await getFileById(currentFolder.id);
                if (folderData && folderData.children) {
                    setFiles(folderData.children);
                }
            } else {
                const data = await fetchFiles();
                setFiles(data);
            }
        } catch (error) {
            console.error("Failed to load files", error);
        }
    };

    useEffect(() => {
        loadFiles();
    }, [currentFolder, activeTab, selectedFile]);

    // --- ניווט ---
    const handleItemClick = async (file) => {
        if (file.type === 'folder') {
            setFolderStack((prevStack) => [...prevStack, currentFolder]);
            setCurrentFolder(file); 
        } else {
            try {
                const fullFileData = await getFileById(file.id);
                setSelectedFile(fullFileData);
            } catch (error) {
                alert("Error loading file content");
            }
        }
    };

    const handleBack = () => {
        if (folderStack.length > 0) {
            const prevStack = [...folderStack];
            const previousFolder = prevStack.pop();
            setFolderStack(prevStack);
            setCurrentFolder(previousFolder);
        } else {
            setCurrentFolder(null);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentFolder(null);
        setFolderStack([]); 
        setSelectedFile(null);
    };

    // --- לוגיקה ופעולות ---
    const getFilteredFiles = () => {
        const notInTrash = files.filter(f => !trashedIds.has(f.id));
        const inTrash = files.filter(f => trashedIds.has(f.id));

        switch (activeTab) {
            case 'Trash': return inTrash;
            case 'Starred': return notInTrash.filter(f => starredIds.has(f.id));
            case 'Shared with me': return notInTrash.filter(f => f.owner !== 'me' && f.owner !== currentUser?.name);
            default: return notInTrash;
        }
    };

    const displayFiles = getFilteredFiles();

    const handleSoftDelete = (fileId) => { 
        setTrashedIds(prev => { const n = new Set(prev); n.add(fileId); return n; }); 
        if (selectedFile && selectedFile.id === fileId) setSelectedFile(null);
    };
    
    const handleRestore = (fileId) => { setTrashedIds(prev => { const n = new Set(prev); n.delete(fileId); return n; }); };
    
    const handlePermanentDelete = async (fileId) => { 
        if(window.confirm("Delete permanently?")) console.log("Deleted", fileId);
    };
    
    const handleToggleStar = (fileId) => { setStarredIds(prev => { const n = new Set(prev); if(n.has(fileId)) n.delete(fileId); else n.add(fileId); return n; }); };

    const handleSaveFile = async (fileId, updates) => {
        try {
            await updateFile(fileId, updates);
            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, ...updates } : f));
            if (selectedFile && selectedFile.id === fileId) {
                setSelectedFile(prev => ({ ...prev, ...updates }));
            }
        } catch (e) {
            alert("Save failed: " + e.message);
        }
    };

    const handleMoveFile = async (file) => {
        const newParentId = prompt("Enter new Folder ID to move to:");
        if (newParentId) {
            try {
                await updateFile(file.id, { parentId: newParentId });
                setSelectedFile(null); 
                loadFiles(); 
            } catch (e) { alert(e.message); }
        }
    };

    const handleCreateFolder = async (folderName) => {
        try {
            await createFile({ name: folderName, type: 'folder', parentId: currentFolder ? currentFolder.id : null });
            setActiveModal(null);
            loadFiles();
        } catch (error) { alert(error.message); }
    };

    const handleCreateTextFile = async (fileName, content) => {
        try {
            await createFile({ name: fileName, type: 'file', parentId: currentFolder ? currentFolder.id : null, content: content });
            setActiveModal(null);
            loadFiles();
        } catch (error) { alert(error.message); }
    };

    const handleUpload = async (fileObj) => {
        if (!fileObj) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                await createFile({
                    name: fileObj.name,
                    type: fileObj.type.startsWith('image/') ? 'image' : 'file',
                    parentId: currentFolder ? currentFolder.id : null,
                    content: e.target.result 
                });
                loadFiles();
            } catch (error) { alert(error.message); }
        };
        reader.readAsText(fileObj); 
    };

    const handleToolbarUpload = (e) => {
        if (e.target.files && e.target.files[0]) handleUpload(e.target.files[0]);
    };

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('he-IL') : '-';
    const formatSize = (bytes) => bytes ? `${(bytes/1024).toFixed(1)} KB` : '-';
    // בדיקה מעודכנת להרשאות בתיקייה
    const canEditFolder = currentFolder ? (currentFolder.owner === 'me' || (currentUser && currentFolder.owner === currentUser.name)) : true;

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            
            <div className="dashboard-body">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={handleTabChange} 
                    onOpenFolderModal={() => setActiveModal('folder')}
                    onOpenTextFileModal={() => setActiveModal('textFile')}
                    onUploadFile={handleUpload}
                    onUploadPhoto={handleUpload}
                />
                
                <main className="main-content">
                    {selectedFile ? (
                        <FileEditor 
                            file={selectedFile}
                            onBack={() => setSelectedFile(null)}
                            onSave={handleSaveFile}
                            onDelete={() => handleSoftDelete(selectedFile.id)}
                            onMove={handleMoveFile}
                            currentUser={currentUser} // <--- שינינו: מעבירים את כל האובייקט
                        />
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    {currentFolder && (
                                        <button onClick={handleBack} className="back-button-styled" title="Go Back">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                        </button>
                                    )}
                                    <h2 className="content-title" style={{marginBottom: 0}}>
                                        {currentFolder ? <><span style={{opacity: 0.7, marginRight: '10px'}}>📁</span> {currentFolder.name}</> : activeTab}
                                    </h2>
                                </div>

                                {canEditFolder && (
                                    <div className="folder-actions" style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => setActiveModal('folder')} className="quick-action-btn">➕ 📁 Folder</button>
                                        <button onClick={() => setActiveModal('textFile')} className="quick-action-btn">➕ 📄 File</button>
                                        <button onClick={() => fileInputRef.current.click()} className="quick-action-btn">☁️ Upload</button>
                                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleToolbarUpload} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="files-table-container">
                                <table className="files-table">
                                    <thead>
                                        <tr><th>Name</th><th>Owner</th><th>Date</th><th>Size</th><th>Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {displayFiles.map(file => {
                                            const isStarred = starredIds.has(file.id);
                                            const isInTrash = activeTab === 'Trash';
                                            return (
                                                <tr key={file.id} onClick={() => handleItemClick(file)} style={{cursor: 'pointer'}}>
                                                    <td className="file-name-cell">
                                                        <span className="file-icon">{file.type === 'folder' ? '📁' : file.type === 'image' ? '🖼️' : '📄'}</span>
                                                        {file.name}
                                                    </td>
                                                    <td>{file.owner || 'Me'}</td>
                                                    <td>{formatDate(file.createdAt)}</td>
                                                    <td>{formatSize(file.size)}</td>
                                                    <td className="actions-cell">
                                                        {!isInTrash && (
                                                            <>
                                                                <button onClick={(e) => { e.stopPropagation(); handleToggleStar(file.id); }} className="action-btn" style={{ color: isStarred ? '#f4b400' : 'inherit', opacity: isStarred ? 1 : 0.4 }}>{isStarred ? '★' : '☆'}</button>
                                                                <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); handleItemClick(file); }}>✏️</button>
                                                                <button className="action-btn delete" style={{color:'red'}} onClick={(e) => { e.stopPropagation(); handleSoftDelete(file.id); }}>🗑️</button>
                                                            </>
                                                        )}
                                                        {isInTrash && (
                                                            <>
                                                                <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleRestore(file.id); }}>♻️</button>
                                                                <button className="action-btn delete" style={{color:'darkred'}} onClick={(e) => { e.stopPropagation(); handlePermanentDelete(file.id); }}>❌</button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {displayFiles.length === 0 && <div style={{textAlign:'center', padding:'50px', opacity:0.6}}>No files found</div>}
                            </div>
                        </>
                    )}
                </main>
            </div>
            <CreateFolderModal isOpen={activeModal === 'folder'} onClose={() => setActiveModal(null)} onCreate={handleCreateFolder} />
            <CreateFileModal isOpen={activeModal === 'textFile'} onClose={() => setActiveModal(null)} onCreate={handleCreateTextFile} />
        </div>
    );
};

export default DashboardPage;