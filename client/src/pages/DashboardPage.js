/* client/src/pages/DashboardPage.js */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Native UI Components & Layout
import Navbar from '../components/Navbar';
import BottomTab from '../components/BottomTab';
import FileList from '../components/Dashboard/FileList';
import AppWrapper from '../components/AppWrapper'; // Animated Ocean Waves
import ActionMenuSheet from '../components/ActionMenuSheet'; // Native Context Menu
import { Icons } from '../utils/Icons';
import { theme } from '../styles/theme';

// Integrated Modals
import CreateFolderModal from '../components/CreateFolderModal';
import CreateFileView from '../components/CreateFileView';
import RenameModal from '../components/RenameModal';
import MoveFileModal from '../components/MoveFileModal';
import PermissionsTab from '../components/PermissionsTab';
import FileEditorView from '../components/FileEditorView';

// Services & Global Helpers
import { 
    fetchFiles, createFile, getFileById, updateFile, 
    getUser, deleteFileApi 
} from '../services/api'; 
import { formatDate, formatSize } from '../utils/dashboardUtils';
import { FileManager } from '../utils/FileManager'; // Native File Logic

const DashboardPage = ({ toggleTheme, isDarkMode, navigation }) => {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    /* --- State Management --- */
    const [activeTab, setActiveTab] = useState('Home');
    const [files, setFiles] = useState([]); 
    const [activeModal, setActiveModal] = useState(null); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    
    // Navigation Stack for Folders
    const [currentFolder, setCurrentFolder] = useState(null);
    const [folderStack, setFolderStack] = useState([]);

    // Persistence States (Migrated from sessionStorage to AsyncStorage)
    const [starredIds, setStarredIds] = useState(new Set());
    const [trashedIds, setTrashedIds] = useState(new Set());

    /* --- Initial Data Load & Persistence --- */
    useEffect(() => {
        const loadInitialContext = async () => {
            try {
                const [savedStarred, savedTrashed, userId] = await Promise.all([
                    AsyncStorage.getItem('starredFiles'),
                    AsyncStorage.getItem('trashedFiles'),
                    AsyncStorage.getItem('userId')
                ]);
                
                if (savedStarred) setStarredIds(new Set(JSON.parse(savedStarred)));
                if (savedTrashed) setTrashedIds(new Set(JSON.parse(savedTrashed)));
                if (userId) {
                    const userData = await getUser(userId);
                    setCurrentUser(userData);
                }
            } catch (error) {
                console.error("Context Load Error:", error);
            }
        };
        loadInitialContext();
    }, []);

    // Sync persistence updates to local storage
    useEffect(() => { 
        AsyncStorage.setItem('starredFiles', JSON.stringify([...starredIds])); 
    }, [starredIds]);
    
    useEffect(() => { 
        AsyncStorage.setItem('trashedFiles', JSON.stringify([...trashedIds])); 
    }, [trashedIds]);

    /* --- Data Fetching Logic --- */
    const loadFiles = async () => {
        setIsLoading(true);
        try {
            let data = [];
            if (currentFolder) {
                // Fetch content for the current folder "Dive"
                const folderData = await getFileById(currentFolder.id);
                data = folderData.children || [];
            } else {
                // Global tab fetching logic
                const showAll = ['Starred', 'Trash', 'Shared With Me'].includes(activeTab);
                data = await fetchFiles(showAll);
            }
            setFiles(data);
        } catch (error) {
            console.error("Fetch drift:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadFiles(); }, [currentFolder, activeTab]);

    /* --- Filtered Display Logic --- */
    const displayFiles = (() => {
        if (currentFolder) return files; 
        if (activeTab === 'Trash') return files.filter(f => trashedIds.has(f.id));
        
        const activeFiles = files.filter(f => !trashedIds.has(f.id));
        switch (activeTab) {
            case 'Starred': return activeFiles.filter(f => starredIds.has(f.id));
            case 'Shared With Me': return activeFiles.filter(f => f.owner !== currentUser?.email && f.userId !== currentUser?.id);
            default: return activeFiles;
        }
    })();

    /* --- Permission Helper --- */
    const getUserRole = (file) => {
        if (!currentUser || !file) return 'none';
        const userEmail = currentUser.email;
        if (file.owner === userEmail) return 'ADMIN'; 
        if (file.permissions) {
            const perm = file.permissions.find(p => p.email === userEmail);
            if (perm) return perm.type; 
        }
        return 'none';
    };

    /* --- Core Handlers (Merged Functionality) --- */
    const handleItemClick = async (file) => {
        const fileId = file._id || file.id;
        if (file.type === 'folder') {
            setFolderStack(prev => [...prev, currentFolder]);
            setCurrentFolder(file); 
        } else {
            const fullFile = await getFileById(fileId);
            setSelectedFile(fullFile);
            setActiveModal('editor');
        }
    };

    const handleGoBack = () => {
        const prevStack = [...folderStack];
        const previous = prevStack.pop();
        setFolderStack(prevStack);
        setCurrentFolder(previous);
    };

    // Native Professional Download
    const handleDownload = async (file) => {
        try {
            const fileData = (file.content || file.type === 'folder') ? file : await getFileById(file.id);
            if (fileData.type === 'folder') {
                Alert.alert("S.E.A. Alert", "Individual file download inside folders is recommended for mobile.");
                return;
            }
            await FileManager.downloadFile(fileData.name, fileData.content);
        } catch (e) { Alert.alert("Error", "Download failed"); }
    };

    const handlePermanentDelete = async (id) => {
        Alert.alert("Delete Forever?", "This item will be permanently removed from the ocean.", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: async () => {
                try {
                    await deleteFileApi(id);
                    setTrashedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
                    loadFiles();
                } catch (e) { Alert.alert("Error", "Failed to delete"); }
            }}
        ]);
    };

    // Native Image/Doc Upload Logic
    const handleUploadAction = async (isImage) => {
        const result = isImage ? await FileManager.pickImage(false) : await FileManager.pickDocument();
    if (result && !result.canceled) {
        const asset = result.assets ? result.assets[0] : result; 
        const base64Data = asset.base64;

        if (!base64Data) {
            Alert.alert("Error", "Could not retrieve image data. Ensure base64 is enabled.");
            return;
        }

        try {
            await createFile({ 
                name: asset.fileName || result.name || `Dive_Image_${Date.now()}.jpg`, 
                type: isImage ? 'image' : 'file', 
                content: base64Data,
                parentId: currentFolder?.id 
            });
            loadFiles();
        } catch (e) { Alert.alert("Error", "Upload failed"); }
    }
};

    // Context Menu Logic
    const getFileActions = (file) => {
        const role = getUserRole(file);
        const isInTrash = trashedIds.has(file.id);

        if (isInTrash) return [
            { label: 'Restore', icon: 'rotate-ccw', onPress: () => setTrashedIds(prev => { const n = new Set(prev); n.delete(file.id); return n; }) },
            { label: 'Delete Forever', icon: 'trash-2', onPress: () => handlePermanentDelete(file.id), danger: true }
        ];

        const actions = [
            { label: 'Download', icon: 'download', onPress: () => handleDownload(file) }
        ];
        
        if (role === 'ADMIN' || role === 'EDITOR') {
            actions.push({ label: 'Rename', icon: 'edit-2', onPress: () => setActiveModal('rename') });
            actions.push({ label: 'Move', icon: 'folder', onPress: () => setActiveModal('move') });
        }
        
        if (role === 'ADMIN') {
            actions.push({ label: 'Permissions', icon: 'lock', onPress: () => setActiveModal('permissions') });
        }
        
        if (role === 'ADMIN' || role === 'EDITOR') {
            actions.push({ label: 'Move to trash', icon: 'trash', onPress: () => setTrashedIds(prev => { const n = new Set(prev); n.add(file.id); return n; }), danger: true });
        }
        
        return actions;
    };

    return (
        <AppWrapper isDarkMode={isDarkMode}>
            <View style={{ flex: 1 }}>
                <Navbar 
                toggleTheme={toggleTheme} 
                isDarkMode={isDarkMode} 
                navigation={navigation}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onFileClick={handleItemClick} // Allows search results to open files
            />

                {/* Dashboard Header & File List */}
                <View style={{ flex: 1, paddingBottom: 80 }}>
                    <View style={styles.headerRow}>
                        {currentFolder && (
                            <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
                                <Icons.BackArrow size={24} color={isDarkMode ? '#fff' : theme.colors.oceanBlue} />
                            </TouchableOpacity>
                        )}
                        <Text style={[styles.title, { color: isDarkMode ? '#fff' : theme.colors.deepNavy }]}>
                            {currentFolder ? currentFolder.name : activeTab}
                        </Text>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="large" color={theme.colors.oceanBlue} style={{ marginTop: 50 }} />
                    ) : (
                        <FileList 
                            files={displayFiles}
                            starredIds={starredIds}
                            handleItemClick={handleItemClick}
                            handleToggleStar={(id) => setStarredIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; })}
                            onOpenActionMenu={(file) => { setSelectedFile(file); setActiveModal('actionMenu'); }}
                            formatDate={formatDate}
                            formatSize={formatSize}
                            isDarkMode={isDarkMode}
                        />
                    )}
                </View>

                {/* Navigation & FAB */}
                <BottomTab 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => { setActiveTab(tab); setCurrentFolder(null); setFolderStack([]); }} 
                    onActionSelect={(type) => {
                        if (type === 'uploadPhoto') handleUploadAction(true);
                        else if (type === 'uploadFile') handleUploadAction(false);
                        else setActiveModal(type);
                    }}
                    isDarkMode={isDarkMode} 
                />
            </View>

            {/* --- Modals Management --- */}
            
            <ActionMenuSheet 
                visible={activeModal === 'actionMenu'}
                onClose={() => setActiveModal(null)}
                file={selectedFile}
                actions={selectedFile ? getFileActions(selectedFile) : []}
                isDarkMode={isDarkMode}
            />

            <CreateFolderModal 
                isOpen={activeModal === 'folder'} 
                onClose={() => setActiveModal(null)}
                onCreate={async (name) => { await createFile({ name, type: 'folder', parentId: currentFolder?.id }); loadFiles(); setActiveModal(null); }}
                isDarkMode={isDarkMode}
            />

            <CreateFileView 
                isOpen={activeModal === 'textFile'} 
                onClose={() => setActiveModal(null)}
                onCreate={async (name, content) => { await createFile({ name, type: 'file', content, parentId: currentFolder?.id }); loadFiles(); setActiveModal(null); }}
                isDarkMode={isDarkMode}
            />

            <FileEditorView 
                isOpen={activeModal === 'editor'}
                file={selectedFile}
                onBack={() => setActiveModal(null)}
                onSave={async (id, updates) => { await updateFile(id, updates); loadFiles(); }}
                currentUser={currentUser}
                isDarkMode={isDarkMode}
            />

            {selectedFile && (
                <>
                    <RenameModal 
                        isOpen={activeModal === 'rename'} 
                        onClose={() => setActiveModal(null)}
                        onRename={async (id, name) => { await updateFile(id, { name }); loadFiles(); setActiveModal(null); }}
                        currentFile={selectedFile}
                        isDarkMode={isDarkMode}
                    />
                    <MoveFileModal 
                        isOpen={activeModal === 'move'} 
                        onClose={() => setActiveModal(null)}
                        onMove={async (target) => { await updateFile(selectedFile.id, { parentId: target?.id || null }); loadFiles(); setActiveModal(null); }}
                        currentFile={selectedFile}
                        isDarkMode={isDarkMode}
                    />
                    <PermissionsTab 
                        isOpen={activeModal === 'permissions'}
                        onClose={() => setActiveModal(null)}
                        file={selectedFile}
                        currentUser={currentUser}
                        isDarkMode={isDarkMode}
                    />
                </>
            )}
        </AppWrapper>
    );
};

const styles = StyleSheet.create({
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, marginBottom: 10 },
    backBtn: { marginRight: 15, padding: 5 },
    title: { fontSize: 24, fontWeight: '900', letterSpacing: 0.5 }
});

export default DashboardPage;