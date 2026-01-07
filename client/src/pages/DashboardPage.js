/* client/src/pages/DashboardPage.js */
import React, { useState, useEffect, useRef } from 'react';

// Components
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FileEditor from '../components/FileEditor'; 
import FileTable from '../components/Dashboard/FileTable';
import ModalManager from '../components/Dashboard/ModalManager';

// Services & Utils
import { fetchFiles, createFile, getFileById, updateFile, getUser, deleteFileApi } from '../services/api'; 
import { isToday, formatDate, formatSize } from '../utils/dashboardUtils';
import { Icons } from '../utils/Icons';

// Styles
import '../styles/layout.css';
import '../styles/actionMenu.css'; 

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
    const [currentFolder, setCurrentFolder] = useState(null);
    const [folderStack, setFolderStack] = useState([]);
    const [globalError, setGlobalError] = useState('');

    /* --- Persistence Logic --- */
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

    /* --- Data Loading --- */
    const loadFiles = async () => {
        try {
            let data = [];
            if (currentFolder) {
                const folderData = await getFileById(currentFolder.id);
                if (folderData && folderData.children) data = folderData.children;
            } else {
                data = await fetchFiles();
            }
            setFiles(data);
        } catch (error) {
            console.error("Failed to load files", error);
        }
    };

    useEffect(() => { loadFiles(); }, [currentFolder, activeTab]);

    /* --- Core Handlers --- */
    const getUserRole = (file) => {
        if (!currentUser || !file) return 'none';
        const currentUserId = String(currentUser.id);
        const currentUserEmail = currentUser.email;
        if (file.owner === currentUserEmail || String(file.owner) === currentUserId || String(file.userId) === currentUserId) return 'ADMIN'; 
        if (file.permissions) {
            const perm = file.permissions.find(p => p.email === currentUserEmail || String(p.userId) === currentUserId);
            if (perm) return perm.type; 
        }
        return 'none';
    };

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
                setGlobalError("Error loading file content"); 
            } finally {
                setIsFileLoading(false);
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
    /* --- Simple File Filtering Logic (No Inheritance) --- */

const displayFiles = (() => {
    // Items that were explicitly moved to trash
    const inTrash = files.filter(f => trashedIds.has(f.id)); 
    
    // Items that are active (not in trash)
    const notInTrash = files.filter(f => !trashedIds.has(f.id));

    switch (activeTab) {
        case 'Trash': 
            return inTrash;

        case 'Starred': 
            // Only items that you personally clicked the star on
            return notInTrash.filter(f => starredIds.has(f.id));

        case 'My Storage': 
            return notInTrash.filter(f => f.owner === currentUser?.email);

        case 'Shared With Me': 
            return notInTrash.filter(f => f.owner !== currentUser?.email);

        case 'Recent': 
            return notInTrash.filter(f => isToday(f.createdAt));

        case 'Home':
        default: 
            // Shows only items belonging to the current directory
            return notInTrash.filter(f => f.parentId === (currentFolder?.id || null));
    }
})(); //

    /* --- File Operations --- */
    const handleSoftDelete = (fileId) => { 
        setTrashedIds(prev => { const n = new Set(prev); n.add(fileId); return n; }); 
        if (selectedFile?.id === fileId) setSelectedFile(null); 
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
            } catch (error) { setGlobalError(error.message) } 
        } 
    };

    const handleToggleStar = (fileId) => { 
        setStarredIds(prev => { const n = new Set(prev); if(n.has(fileId)) n.delete(fileId); else n.add(fileId); return n; }); 
    };

    const handleSaveFile = async (fileId, updates) => { 
        try { 
            await updateFile(fileId, { id: fileId, ...updates }); 
            loadFiles();
            if (selectedFile?.id === fileId) setSelectedFile(prev => ({...prev, ...updates})); 
        } catch (e) { setGlobalError("Save failed: " + e.message); } 
    };

    const handleMoveConfirm = async (targetFolder) => { 
        try { 
            await updateFile(fileToMove.id, { parentId: targetFolder?.id || null }); 
            setActiveModal(null); setFileToMove(null); setSelectedFile(null); loadFiles(); 
        } catch (e) { setGlobalError("Move failed: " + e.message) } 
    };

    const handleRenameFile = async (fileId, newName) => { 
        try { 
            await updateFile(fileId, { name: newName }); 
            loadFiles();
            setActiveModal(null); 
        } catch (error) { setGlobalError("Rename failed: " + error.message) } 
    };

    const handleCreateFolder = async (name) => { 
        try { await createFile({ name, type: 'folder', parentId: currentFolder?.id }); setActiveModal(null); loadFiles(); } 
        catch (e) { setGlobalError(e.message); } 
    };

    const handleCreateTextFile = async (name, content) => { 
        try { await createFile({ name, type: 'file', content, parentId: currentFolder?.id }); setActiveModal(null); loadFiles(); } 
        catch (e) { setGlobalError(e.message); } 
    };

    const handleUpload = async (fileObj) => { 
        if (!fileObj) return; 
        const reader = new FileReader();
        const isImage = fileObj.type.startsWith('image/');
        reader.onload = async () => {
            try {
                const content = isImage ? reader.result.split(',')[1] : reader.result;
                await createFile({ name: fileObj.name, type: isImage ? 'image' : 'file', content, parentId: currentFolder?.id });
                loadFiles();
            } catch (e) { setGlobalError("Upload failed"); }
        };
        isImage ? reader.readAsDataURL(fileObj) : reader.readAsText(fileObj);
    };

/**
 * Original Simple Download Handler
 * Downloads file content as a basic Blob.
 */
 /**
 * Professional File & Folder Downloader
 * Handles recursive folder downloads and safe Base64 decoding for images.
 */
const handleDownload = async (file) => {
    let fileToProcess = file;
 
    try {
        // 1. Fetch full data if content is missing (Optimization for list views)
        if (!file.content && file.type !== 'folder') {
            fileToProcess = await getFileById(file.id);
        }

        // 2. Recursive download for folders
        if (fileToProcess.type === 'folder') {
            const fullFolder = await getFileById(fileToProcess.id);
            if (fullFolder.children && fullFolder.children.length > 0) {
                // Recursive call for each child in the folder
                fullFolder.children.forEach(child => handleDownload(child));
            }
            return;
        }

        // 3. Guard Clause: Check if content is still missing after fetch
        if (!fileToProcess.content) {
            alert("File content is missing and cannot be downloaded.");
            return;
        }

        let blob;
        // 4. Content Processing based on File Type
        if (fileToProcess.type === 'image') {
            /* Safely convert Base64 string to Binary Data */
            const byteCharacters = atob(fileToProcess.content.trim());
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: 'image/png' });
        } else {
            /* Standard text processing with UTF-8 encoding */
            blob = new Blob([fileToProcess.content], { type: 'text/plain;charset=utf-8' });
        }

        // 5. Trigger Browser Download via virtual link
        const url = URL.createObjectURL(blob);
        const element = document.createElement("a");
        element.href = url;
        element.download = fileToProcess.name;
        document.body.appendChild(element);
        element.click();
        
        // 6. Cleanup to prevent memory leaks
        document.body.removeChild(element);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Download Error:", error);
        alert("An error occurred during the download process.");
    }
};

    const getFileActions = (file, isInsideEditor = false) => {
        const role = getUserRole(file);
        const isInTrash = activeTab === 'Trash';
        if (isInTrash) return [
            { label: 'Restore', icon: <Icons.Restore size={18} />, onClick: () => handleRestore(file.id) }, 
            { label: 'Delete Forever', icon: <Icons.Trash size={20} />, onClick: () => handlePermanentDelete(file.id), danger: true }
        ];

        const actions = [
            { label: 'Download', icon: <Icons.Download size={18} />, onClick: () => handleDownload(file) }
        ];
        if (!isInsideEditor) actions.push({ label: 'View / Edit', icon: <Icons.Eye size={18} />, onClick: () => handleItemClick(file) });
        if (role === 'ADMIN' || role === 'EDITOR') {
            actions.push({ label: 'Rename', icon: <Icons.Rename size={18} />, onClick: () => { setFileToRename(file); setActiveModal('rename'); } });
            actions.push({ label: 'Move', icon: <Icons.Folder size={18} />, onClick: () => { setFileToMove(file); setActiveModal('move'); } });
        }
        if (role === 'ADMIN') actions.push({ label: 'Permissions', icon: <Icons.Lock size={18} />, onClick: () => { setFileToManagePerms(file); setActiveModal('permissions'); } });
        if (role === 'ADMIN' || role === 'EDITOR') actions.push({ label: 'Move to trash', icon: <Icons.Delete size={18} />, onClick: () => handleSoftDelete(file.id), danger: true });
        return actions;
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
                
                <main className="main-content">
                    {isFileLoading && <div className="loading-overlay"><span>🐡</span><h3>Swimming to surface...</h3></div>}
                    
                    {globalError && (
                        <div className="error-bubble">
                            {globalError}
                            <button onClick={() => setGlobalError('')}>✕</button>
                        </div>
                    )}

                    {selectedFile ? (
                        <FileEditor 
                            file={selectedFile}
                            onBack={() => setSelectedFile(null)}
                            onSave={handleSaveFile}
                            currentUser={currentUser}
                            menuActions={getFileActions(selectedFile, true)} 
                        />
                    ) : (
                        <>
                            <div className="content-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
    {currentFolder && (
        <button onClick={handleBack} className="back-circle-btn" title="Go Back">
            <Icons.BackArrow size={20} />
        </button>
    )}
    <h2 className="content-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentFolder ? (
            <>
                <Icons.Folder size={32} style={{ opacity: 0.9 }} />
                {currentFolder.name}
            </>
        ) : (
            activeTab
        )}
    </h2>
</div>
                            
                            <FileTable 
                                files={displayFiles}
                                starredIds={starredIds}
                                handleItemClick={handleItemClick}
                                handleToggleStar={handleToggleStar}
                                getFileActions={getFileActions}
                                formatDate={formatDate}
                                formatSize={formatSize}
                                activeTab={activeTab}
                            />
                        </>
                    )}
                </main>
            </div>

            <ModalManager 
                activeModal={activeModal} 
                setActiveModal={setActiveModal}
                handlers={{ handleRenameFile, handleCreateFolder, handleCreateTextFile, handleMoveConfirm, handleSavePermissions: async (id, perms) => { await updateFile(id, perms); loadFiles(); setActiveModal(null); } }}
                data={{ fileToRename, fileToMove, fileToManagePerms, currentUser }}
            />
        </div>
    );
};

export default DashboardPage;