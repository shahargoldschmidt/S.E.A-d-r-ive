/* client/src/pages/DashboardPage.js */
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreateFolderModal from '../components/CreateFolderModal'; 
import CreateFileModal from '../components/CreateFileModal'; 
import FileEditor from '../components/FileEditor'; 
import ActionMenu from '../components/ActionMenu'; 
import MoveFileModal from '../components/MoveFileModal';
import PermissionsModal from '../components/PermissionsModal';
import RenameModal from '../components/RenameModal'; // הוסף את הייבוא
import { fetchFiles, createFile, getFileById, updateFile, getUser, deleteFileApi } from '../services/api'; 
import '../styles/layout.css';
import '../styles/actionMenu.css'; 

const DashboardPage = ({ toggleTheme, isDarkMode }) => {
    // --- State ---
    const [activeTab, setActiveTab] = useState('Home');
    const [files, setFiles] = useState([]); 
    const [activeModal, setActiveModal] = useState(null); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [fileToManagePerms, setFileToManagePerms] = useState(null); 
    const [fileToMove, setFileToMove] = useState(null);
    const [fileToRename, setFileToRename] = useState(null);

    const fileInputRef = useRef(null);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [folderStack, setFolderStack] = useState([]);

    const [starredIds, setStarredIds] = useState(() => {
        const saved = sessionStorage.getItem('starredFiles');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [trashedIds, setTrashedIds] = useState(() => {
        const saved = sessionStorage.getItem('trashedFiles');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => { sessionStorage.setItem('starredFiles', JSON.stringify([...starredIds])); }, [starredIds]);
    useEffect(() => { sessionStorage.setItem('trashedFiles', JSON.stringify([...trashedIds])); }, [trashedIds]);
    
    useEffect(() => {
        const loadUser = async () => {
            const userId = sessionStorage.getItem('userId');
            if (userId) getUser(userId).then(setCurrentUser).catch(console.error);
        };
        loadUser();
    }, []);

    const loadFiles = async () => {
        try {
            let data = [];
            if (currentFolder) {
                const folderData = await getFileById(currentFolder.id);
                if (folderData && folderData.children) {
                    data = folderData.children;
                }
            } else {
                data = await fetchFiles();
            }
            setFiles(data);
        } catch (error) {
            console.error("Failed to load files", error);
        }
    };

    // --- חישוב תפקיד (User Role) ---
    const getUserRole = (file) => {
        if (!currentUser || !file) return 'none';
        
        const currentUserId = String(currentUser.id);
        const currentUserEmail = currentUser.email;
        const fileOwner = String(file.owner);
        const fileUserId = file.userId ? String(file.userId) : null;

        if (fileOwner === currentUserEmail || fileOwner === currentUserId || fileUserId === currentUserId) {
            return 'ADMIN'; 
        }

        if (file.permissions && Array.isArray(file.permissions)) {
            const perm = file.permissions.find(p => 
                p.email === currentUserEmail || String(p.userId) === currentUserId
            );
            if (perm) return perm.type; 
        }
        return 'none';
    };

   useEffect(() => { 
        loadFiles(); 
    }, [currentFolder, activeTab]);


    const handleItemClick = async (file) => {
        if (file.type === 'folder') {
            setFolderStack((prevStack) => [...prevStack, currentFolder]);
            setCurrentFolder(file); 
        } else {
            try {
                const fullFileData = await getFileById(file.id);
                setSelectedFile({ ...file, ...fullFileData });
            } catch (error) { 
                console.error("Error opening file", error);
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

    const getFilteredFiles = () => {
        const notInTrash = files.filter(f => !trashedIds.has(f.id));
        const inTrash = files.filter(f => trashedIds.has(f.id));

        switch (activeTab) {
            case 'Trash': 
                return inTrash;
            case 'Starred': 
                return notInTrash.filter(f => starredIds.has(f.id));
            case 'My Storage':
                return notInTrash.filter(f => {
                     const isOwner = f.owner === currentUser.email || String(f.owner) === String(currentUser.id);
                     return isOwner;
                });
            case 'Shared With Me': 
                return notInTrash.filter(f => {
                    const isOwner = f.owner === currentUser.email || String(f.owner) === String(currentUser.id);
                    return !isOwner; 
                });
            case 'Home':
            default: 
                return notInTrash;
        }
    };

    const displayFiles = getFilteredFiles();

    const handleSoftDelete = (fileId) => { 
        setTrashedIds(prev => { const n = new Set(prev); n.add(fileId); return n; }); 
        if (selectedFile && selectedFile.id === fileId) setSelectedFile(null);
    };
    const handleRestore = (fileId) => { setTrashedIds(prev => { const n = new Set(prev); n.delete(fileId); return n; }); };
    const handlePermanentDelete = async (fileId) => { if(window.confirm("Are you sure you want to delete this file permanently? This cannot be undone.")) {
            try {
                await deleteFileApi(fileId);
                // הסרה מהרשימה של "סל המיחזור" (Trash)
                setTrashedIds(prev => { 
                    const n = new Set(prev); 
                    n.delete(fileId); 
                    return n; 
                });
                // טעינה מחדש של הקבצים כדי שהקובץ ייעלם מהמסך
                loadFiles();
            } catch (error) {
                alert("Error deleting file: " + error.message);
            }
        } 
    };
    const handleToggleStar = (fileId) => { setStarredIds(prev => { const n = new Set(prev); if(n.has(fileId)) n.delete(fileId); else n.add(fileId); return n; }); };

   // --- לוגיקת שמירה מתוקנת ---
    const handleSaveFile = async (fileId, updates) => {
        try {
            // תיקון קריטי: השרת מצפה לקבל את ה-ID כחלק מהאובייקט המעודכן
            // אנחנו מאחדים את ה-ID ביחד עם השדות שהשתנו (name, content)
            const payload = { 
                id: fileId, 
                ...updates 
            };

            // 1. שליחת העדכון לשרת (עכשיו הגוף מכיל גם את ה-ID)
            await updateFile(fileId, payload);
            
            // 2. משיכה מחדש מהשרת כדי לוודא סנכרון מלא (חשוב מאוד לתוכן TCP)
            const freshData = await getFileById(fileId);

            // 3. עדכון הסטייט המקומי עם המידע האמיתי מהשרת
            setFiles(prev => prev.map(f => f.id === fileId ? freshData : f));
            
            if (selectedFile && selectedFile.id === fileId) {
                setSelectedFile(freshData);
            }
        } catch (e) { 
            console.error("Save error:", e);
            alert("Save failed: " + e.message); 
        }
    };
    
    const openMoveModal = (file) => {
        setFileToMove(file);
        setActiveModal('move');
    };

    const handleMoveConfirm = async (targetFolder) => {
        if (!fileToMove) return;
        const targetFolderId = targetFolder ? targetFolder.id : null; 
        try {
            await updateFile(fileToMove.id, { parentId: targetFolderId });
            setActiveModal(null);
            setFileToMove(null);
            setSelectedFile(null); 
            loadFiles(); 
        } catch (e) { alert(e.message); }
    };

    // הוסף את הפונקציה הזו בתוך DashboardPage (למשל ליד handleMoveConfirm)
    const handleRenameFile = async (fileId, newName) => {
        try {
            // שליחה לשרת (עובד גם לקבצים וגם לתיקיות)
            await updateFile(fileId, { name: newName });
            
            // עדכון ה-UI המקומי
            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f));
            
            // אם במקרה הקובץ פתוח כרגע, נעדכן גם את הכותרת שלו
            if (selectedFile && selectedFile.id === fileId) {
                setSelectedFile(prev => ({ ...prev, name: newName }));
            }
            setActiveModal(null);
        } catch (error) {
            alert("Failed to rename: " + error.message);
        }
    };

    const handleCreateFolder = async (folderName) => {
        try { await createFile({ name: folderName, type: 'folder', parentId: currentFolder ? currentFolder.id : null }); setActiveModal(null); loadFiles(); } catch (error) { alert(error.message); }
    };
    const handleCreateTextFile = async (fileName, content) => {
        try { await createFile({ name: fileName, type: 'file', parentId: currentFolder ? currentFolder.id : null, content: content }); setActiveModal(null); loadFiles(); } catch (error) { alert(error.message); }
    };
    const handleUpload = async (fileObj) => {
        if (!fileObj) return;
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try { 
                await createFile({ 
                    name: fileObj.name, 
                    // קובע את הסוג לפי ה-MIME type של הקובץ
                    type: fileObj.type.startsWith('image/') ? 'image' : 'file', 
                    parentId: currentFolder ? currentFolder.id : null, 
                    content: e.target.result 
                }); 
                loadFiles(); 
            } catch (error) { 
                alert(error.message); 
            }
        };

        // 👇 התיקון הקריטי: בדיקה האם זו תמונה
        if (fileObj.type.startsWith('image/')) {
            reader.readAsDataURL(fileObj); // קורא תמונות כ-Base64 שדפדפן יודע להציג
        } else {
            reader.readAsText(fileObj);    // קורא קבצים רגילים כטקסט
        }
    };

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('he-IL') : '-';
    const formatSize = (bytes) => bytes ? `${(bytes/1024).toFixed(1)} KB` : '-';

    // --- עדכון אייקונים ושמות ---
    const getFileActions = (file, isInsideEditor = false) => {
        const role = getUserRole(file);
        const isInTrash = activeTab === 'Trash';

        const canEdit = role === 'ADMIN' || role === 'EDITOR';
        const canManagePermissions = role === 'ADMIN'; 
        const canDelete = role === 'ADMIN' || role === 'EDITOR';

        if (isInTrash) {
            return [
                { label: 'Restore', icon: '♻️', onClick: () => handleRestore(file.id) },
                { label: 'Delete Forever', icon: '❌', onClick: () => handlePermanentDelete(file.id), danger: true }
            ];
        }

        const actions = [];
        
        // תיקון: אייקון עיפרון וטקסט View / Edit
        if (!isInsideEditor) {
            actions.push({ label: 'View / Edit', icon: '✏️', onClick: () => handleItemClick(file) }, );
        }

        if (canEdit) {
            // הוספת Rename (החלק החדש)
            actions.push({ 
                label: 'Rename', 
                icon: '✏️', 
                onClick: () => {
                    setFileToRename(file); 
                    setActiveModal('rename'); 
                }
            });
            actions.push({ label: 'Move', icon: '📂', onClick: () => openMoveModal(file) });
        }

        if (canManagePermissions) {
            actions.push({ 
                label: 'Permissions', 
                icon: '🔒', 
                onClick: () => {
                    setFileToManagePerms(file);
                    setActiveModal('permissions');
                }
            });
        }

        if (canDelete) {
             actions.push({ label: 'Move to trash', icon: '🗑️', onClick: () => handleSoftDelete(file.id), danger: true });
        }

        return actions;
    };

    const handleSavePermissions = async (fileId, newPermissionsObj) => {
        try {
            await updateFile(fileId, newPermissionsObj);
            // גם כאן, נמשוך מחדש ליתר ביטחון
            const freshData = await getFileById(fileId);
            setFiles(prev => prev.map(f => f.id === fileId ? freshData : f));
            if (selectedFile && selectedFile.id === fileId) {
                setSelectedFile(freshData);
            }
        } catch (error) {
            alert('Failed to update permissions');
        }
    };

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Navbar 
                toggleTheme={toggleTheme} 
                isDarkMode={isDarkMode} 
                onFileClick={handleItemClick} 
            />
            
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
                            onDelete={() => { handleSoftDelete(selectedFile.id); setSelectedFile(null); }}
                            onMove={() => openMoveModal(selectedFile)} 
                            currentUser={currentUser}
                            onToggleStar={() => handleToggleStar(selectedFile.id)}
                            isStarred={starredIds.has(selectedFile.id)}
                            // העברת הפעולות ללא כפתור ה-View / Edit
                            menuActions={getFileActions(selectedFile, true)} 
                        />
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    {currentFolder && (
                                        <button onClick={handleBack} className="back-circle-btn" title="Go Back">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                        </button>
                                    )}
                                    <h2 className="content-title" style={{marginBottom: 0}}>
                                        {currentFolder ? <><span style={{opacity: 0.7, marginRight: '10px'}}>📁</span> {currentFolder.name}</> : activeTab}
                                    </h2>
                                </div>
                            </div>
                            
                            <div className="files-table-container">
                                <table className="files-table">
                                    <thead>
                                        <tr><th>Name</th><th>Owner</th><th>Date</th><th>Size</th><th style={{width: '100px'}}></th></tr>
                                    </thead>
                                    <tbody>
                                        {displayFiles.map(file => {
                                            const isStarred = starredIds.has(file.id);
                                            return (
                                                <tr key={file.id} onClick={() => handleItemClick(file)} style={{cursor: 'pointer'}}>
                                                    <td className="file-name-cell">
                                                        <span className="file-icon">{file.type === 'folder' ? '📁' : file.type === 'image' ? '🖼️' : '📄'}</span>
                                                        {file.name}
                                                    </td>
                                                    <td>{file.owner || 'Me'}</td>
                                                    <td>{formatDate(file.createdAt)}</td>
                                                    <td>{formatSize(file.size)}</td>
                                                    
                                                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                                        {activeTab !== 'Trash' && (
                                                            <button 
                                                                className="action-btn" 
                                                                onClick={(e) => { e.stopPropagation(); handleToggleStar(file.id); }}
                                                                style={{ color: isStarred ? '#f4b400' : '#ccc', marginRight: '5px' }}
                                                                title={isStarred ? "Unstar" : "Star"}
                                                            >
                                                                {isStarred ? '★' : '☆'}
                                                            </button>
                                                        )}
                                                        <ActionMenu actions={getFileActions(file, false)} />
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
            <RenameModal 
                isOpen={activeModal === 'rename'} 
                onClose={() => setActiveModal(null)} 
                onRename={handleRenameFile} 
                currentFile={fileToRename} 
            />
            <CreateFolderModal isOpen={activeModal === 'folder'} onClose={() => setActiveModal(null)} onCreate={handleCreateFolder} />
            <CreateFileModal isOpen={activeModal === 'textFile'} onClose={() => setActiveModal(null)} onCreate={handleCreateTextFile} />
            <MoveFileModal isOpen={activeModal === 'move'} onClose={() => setActiveModal(null)} onMove={handleMoveConfirm} currentFile={fileToMove} />
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files[0])} />
            <PermissionsModal isOpen={activeModal === 'permissions'} onClose={() => setActiveModal(null)} onSave={handleSavePermissions} file={fileToManagePerms} currentUser={currentUser} />
        </div>
    );
};
export default DashboardPage;