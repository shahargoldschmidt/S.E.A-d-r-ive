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
import RenameModal from '../components/RenameModal'; 
import { fetchFiles, createFile, getFileById, updateFile, getUser, deleteFileApi } from '../services/api'; 
import '../styles/layout.css';
import '../styles/actionMenu.css'; 
import {Icons} from '../utils/Icons';

const DashboardPage = ({ toggleTheme, isDarkMode }) => {
    /* --- State Management --- */
    const [activeTab, setActiveTab] = useState('Home');
    const [files, setFiles] = useState([]); 
    const [activeModal, setActiveModal] = useState(null); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileLoading, setIsFileLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [fileToManagePerms, setFileToManagePerms] = useState(null); 
    const [fileToMove, setFileToMove] = useState(null);
    const [fileToRename, setFileToRename] = useState(null);

    const fileInputRef = useRef(null);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [folderStack, setFolderStack] = useState([]);

    /* Sync Starred and Trashed items with sessionStorage for persistence */
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

    /* Fetch files based on the current folder context or root directory */
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

    /* Helper function to determine user access level for a specific file */
    const getUserRole = (file) => {
        if (!currentUser || !file) return 'none';
        const currentUserId = String(currentUser.id);
        const currentUserEmail = currentUser.email;
        const fileOwner = String(file.owner);
        const fileUserId = file.userId ? String(file.userId) : null;

        if (fileOwner === currentUserEmail || fileOwner === currentUserId || fileUserId === currentUserId) return 'ADMIN'; 
        if (file.permissions && Array.isArray(file.permissions)) {
            const perm = file.permissions.find(p => p.email === currentUserEmail || String(p.userId) === currentUserId);
            if (perm) return perm.type; 
        }
        return 'none';
    };

    useEffect(() => { loadFiles(); }, [currentFolder, activeTab]);

    /* Handle file opening or folder navigation */
    const handleItemClick = async (file) => {
        if (file.type === 'folder') {
            setFolderStack((prevStack) => [...prevStack, currentFolder]);
            setCurrentFolder(file); 
        } else {
            setIsFileLoading(true);
            try {
                const fullFileData = await getFileById(file.id);
                setSelectedFile({ ...file, ...fullFileData });
            } catch (error) { 
                console.error("Error opening file", error);
                alert("Error loading file content"); 
            } finally {
                setIsFileLoading(false);
            }
        }
    };

    /* Navigate back to previous folder in the breadcrumb stack */
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

    const isToday = (dateStr) => {
    const fileDate = new Date(dateStr);
    const today = new Date();
    return fileDate.getDate() === today.getDate() &&
           fileDate.getMonth() === today.getMonth() &&
           fileDate.getFullYear() === today.getFullYear();
}

    /* Filter files based on the active navigation tab (Trash, Starred, etc.) */
    const getFilteredFiles = () => {
        const notInTrash = files.filter(f => !trashedIds.has(f.id));
        const inTrash = files.filter(f => trashedIds.has(f.id));
        switch (activeTab) {
            case 'Trash': return inTrash;
            case 'Starred': return notInTrash.filter(f => starredIds.has(f.id));
            case 'My Storage': return notInTrash.filter(f => f.owner === currentUser.email || String(f.owner) === String(currentUser.id));
            case 'Shared With Me': return notInTrash.filter(f => !(f.owner === currentUser.email || String(f.owner) === String(currentUser.id)));
            case 'Home': default: return notInTrash;
            case 'Recent': return notInTrash.filter(f => isToday(f.createdAt));
            
        }
    };
    const displayFiles = getFilteredFiles();

    /* --- File Operations --- */
    const handleSoftDelete = (fileId) => { 
        setTrashedIds(prev => { const n = new Set(prev); n.add(fileId); return n; }); 
        if (selectedFile && selectedFile.id === fileId) setSelectedFile(null); 
    };
    
    const handleRestore = (fileId) => { 
        setTrashedIds(prev => { const n = new Set(prev); n.delete(fileId); return n; }); 
    };
    
    const handlePermanentDelete = async (fileId) => { 
        if(window.confirm("Are you sure?")) { 
            try { 
                await deleteFileApi(fileId); 
                setTrashedIds(prev => { const n = new Set(prev); n.delete(fileId); return n; }); 
                loadFiles(); 
            } catch (error) { alert("Error: " + error.message); } 
        } 
    };

    const handleToggleStar = (fileId) => { 
        setStarredIds(prev => { const n = new Set(prev); if(n.has(fileId)) n.delete(fileId); else n.add(fileId); return n; }); 
    };

    const handleSaveFile = async (fileId, updates) => { 
        try { 
            const payload = { id: fileId, ...updates }; 
            await updateFile(fileId, payload); 
            const freshData = await getFileById(fileId); 
            setFiles(prev => prev.map(f => f.id === fileId ? freshData : f)); 
            if (selectedFile && selectedFile.id === fileId) setSelectedFile(freshData); 
        } catch (e) { alert("Save failed: " + e.message); } 
    };

    const openMoveModal = (file) => { setFileToMove(file); setActiveModal('move'); };
    
    const handleMoveConfirm = async (targetFolder) => { 
        if (!fileToMove) return; 
        const targetFolderId = targetFolder ? targetFolder.id : null; 
        try { 
            await updateFile(fileToMove.id, { parentId: targetFolderId }); 
            setActiveModal(null); setFileToMove(null); setSelectedFile(null); loadFiles(); 
        } catch (e) { alert(e.message); } 
    };

    const handleRenameFile = async (fileId, newName) => { 
        try { 
            await updateFile(fileId, { name: newName }); 
            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f)); 
            if (selectedFile && selectedFile.id === fileId) setSelectedFile(prev => ({ ...prev, name: newName })); 
            setActiveModal(null); 
        } catch (error) { alert("Failed: " + error.message); } 
    };

    const handleCreateFolder = async (folderName) => { 
        try { 
            await createFile({ name: folderName, type: 'folder', parentId: currentFolder ? currentFolder.id : null }); 
            setActiveModal(null); loadFiles(); 
        } catch (error) { alert(error.message); } 
    };

    const handleCreateTextFile = async (fileName, content) => { 
        try { 
            await createFile({ name: fileName, type: 'file', parentId: currentFolder ? currentFolder.id : null, content: content }); 
            setActiveModal(null); loadFiles(); 
        } catch (error) { alert(error.message); } 
    };
    const handleDownload = async (file) => {
    /* Recursive download for folders */
    if (file.type === 'folder') {
        const fullFolder = await getFileById(file.id);
        if (fullFolder.children) {
            fullFolder.children.forEach(child => handleDownload(child));
        }
        return;
    }

    if (!file.content) {
        alert("File content is missing and cannot be downloaded.");
        return;
    }

    let blob;
    try {
        if (file.type === 'image') {
            /* Convert Base64 string to Binary Data safely */
            const byteCharacters = atob(file.content.trim());
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: 'image/png' });
        } else {
            /* Handle text files with proper UTF-8 encoding */
            blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
        }
    } catch (e) {
        console.error("Download encoding error:", e);
        /* Fallback: treat as plain text if Base64 decoding fails */
        blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    }

    /* Trigger the browser download */
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    
    /* Cleanup */
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
};

    /* Handle file uploads, converting binary data to Base64 for images or raw text for files */
    const handleUpload = async (fileObj) => { 
        if (!fileObj) return; 
        const toBase64 = (f) => new Promise((r, j) => { const reader = new FileReader(); reader.readAsDataURL(f); reader.onload = () => r(reader.result); reader.onerror = j; }); 
        const toText = (f) => new Promise((r, j) => { const reader = new FileReader(); reader.readAsText(f); reader.onload = () => r(reader.result); reader.onerror = j; }); 
        try { 
            let content; 
            const isImage = fileObj.type.startsWith('image/'); 
            if (isImage) { 
                const fullBase64 = await toBase64(fileObj); 
                content = fullBase64.split(',')[1]; 
            } else { 
                content = await toText(fileObj); 
            } 
            await createFile({ name: fileObj.name, type: isImage ? 'image' : 'file', parentId: currentFolder ? currentFolder.id : null, content: content }); 
            await loadFiles(); 
        } catch (error) { alert("Upload error: " + (error.response?.data?.message || error.message)); } 
    };

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('he-IL') : '-';
    const formatSize = (bytes) => bytes ? `${(bytes/1024).toFixed(1)} KB` : '-';

    /* Generate available actions for each file based on context and user permissions */
    const getFileActions = (file, isInsideEditor = false) => {
        const role = getUserRole(file);
        const isInTrash = activeTab === 'Trash';
        const canEdit = role === 'ADMIN' || role === 'EDITOR';
        const canManagePermissions = role === 'ADMIN'; 
        const canDelete = role === 'ADMIN' || role === 'EDITOR';

        if (isInTrash) return [
            { label: 'Restore', icon: <Icons.Restore size={18} />, onClick: () => handleRestore(file.id) }, 
            { label: 'Delete Forever', icon: <Icons.Trash size={20} />, onClick: () => handlePermanentDelete(file.id), danger: true }
        ];

        const actions = [];
        actions.push({ label: 'Download',  icon: <Icons.Download size={18} />, 
        onClick: () => handleDownload(file) });
        if (!isInsideEditor) actions.push({ label: 'View / Edit', icon: <Icons.Eye size={18} />, onClick: () => handleItemClick(file) });
        if (canEdit) { 
            actions.push({ label: 'Rename', icon: <Icons.Rename size={18} />, onClick: () => { setFileToRename(file); setActiveModal('rename'); } }); 
            actions.push({ label: 'Move', icon: <Icons.Folder size={18} />, onClick: () => openMoveModal(file) }); 
        }
        if (canManagePermissions) actions.push({ label: 'Permissions', icon: <Icons.Lock size={18} />, onClick: () => { setFileToManagePerms(file); setActiveModal('permissions'); } });
        if (canDelete) actions.push({ label: 'Move to trash', icon: <Icons.Delete size={18} />, onClick: () => handleSoftDelete(file.id), danger: true });
        return actions;
    };

    const handleSavePermissions = async (fileId, newPerms) => { 
        try { 
            await updateFile(fileId, newPerms); 
            const freshData = await getFileById(fileId); 
            setFiles(prev => prev.map(f => f.id === fileId ? freshData : f)); 
            if (selectedFile && selectedFile.id === fileId) setSelectedFile(freshData); 
        } catch (error) { alert('Failed to update permissions'); } 
    };

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} onFileClick={handleItemClick} />
            
            <div className="dashboard-body">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={handleTabChange} 
                    onOpenFolderModal={() => setActiveModal('folder')}
                    onOpenTextFileModal={() => setActiveModal('textFile')}
                    onUploadFile={handleUpload}
                    onUploadPhoto={handleUpload}
                />
                
                <main className="main-content" style={{ position: 'relative' }}>
                    
                    {/* Visual loading indicator during file content retrieval */}
                    {isFileLoading && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 50,
                            backdropFilter: 'blur(2px)',
                            borderRadius: '12px' 
                        }}>
                             <span style={{ fontSize: '4rem', animation: 'bounce 1s infinite' }}>🐡</span>
                             <h3 style={{ 
                                color: '#0284c7', 
                                marginTop: '15px', 
                                fontSize: '1.5rem',
                                animation: 'pulse 1.5s infinite' 
                            }}>
                                Swimming to surface...
                            </h3>
                        </div>
                    )}

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
                                                        <span className="file-icon">{file.type === 'folder' ? <Icons.Folder size={30} /> : file.type === 'image' ? <Icons.Image size={30} /> : <Icons.File size={30} />}</span>
                                                        {file.name}
                                                    </td>
                                                    <td>{file.owner || 'Me'}</td>
                                                    <td>{formatDate(file.createdAt)}</td>
                                                    <td>{formatSize(file.size)}</td>
                                                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                                        {activeTab !== 'Trash' && (
                                                            <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleToggleStar(file.id); }} style={{ color: isStarred ? '#f4b400' : '#ccc', marginRight: '5px' }}>
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
            
            <style>{`
                @keyframes bounce { 0%, 100% { transform: translateY(-25%); } 50% { transform: translateY(0); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
            `}</style>

            <RenameModal isOpen={activeModal === 'rename'} onClose={() => setActiveModal(null)} onRename={handleRenameFile} currentFile={fileToRename} />
            <CreateFolderModal isOpen={activeModal === 'folder'} onClose={() => setActiveModal(null)} onCreate={handleCreateFolder} />
            <CreateFileModal isOpen={activeModal === 'textFile'} onClose={() => setActiveModal(null)} onCreate={handleCreateTextFile} />
            <MoveFileModal isOpen={activeModal === 'move'} onClose={() => setActiveModal(null)} onMove={handleMoveConfirm} currentFile={fileToMove} />
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files[0])} />
            <PermissionsModal isOpen={activeModal === 'permissions'} onClose={() => setActiveModal(null)} onSave={handleSavePermissions} file={fileToManagePerms} currentUser={currentUser} />
        </div>
    );
};
export default DashboardPage;