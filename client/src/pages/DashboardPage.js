/* client/src/pages/DashboardPage.js */
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreateFolderModal from '../components/CreateFolderModal'; 
import { fetchFiles, createFile } from '../services/api'; // ייבוא הפונקציות החדשות מה-API
import '../styles/layout.css';

const DashboardPage = ({ toggleTheme, isDarkMode }) => {
    const [activeTab, setActiveTab] = useState('My Drive');
    const [files, setFiles] = useState([]); // המקום בו נשמרים הקבצים
    const [activeModal, setActiveModal] = useState(null); // 'folder' | 'file' | null

    // 1. טעינת קבצים מהשרת (GET)
    const loadFiles = async () => {
        try {
            const data = await fetchFiles();
            setFiles(data);
        } catch (error) {
            console.error("Failed to load files", error);
        }
    };

    // טעינה ראשונית כשהדף עולה
    useEffect(() => {
        loadFiles();
    }, []);

    // 2. יצירת תיקייה (POST)
    const handleCreateFolder = async (folderName) => {
        try {
            const folderData = {
                name: folderName,
                type: 'folder',
                parentId: null // כרגע תמיד בראשי
            };
            
            await createFile(folderData); // שליחה לשרת
            setActiveModal(null); // סגירת המודל
            loadFiles(); // רענון המסך כדי לראות את התיקייה החדשה
        } catch (error) {
            alert("Error creating folder: " + error.message);
        }
    };

    // פונקציית דמה לקובץ (תוסיפי בהמשך)
    const handleCreateFile = () => {
        alert("Add File modal coming soon!");
        setActiveModal(null);
    };

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            
            <div className="dashboard-body">
                {/* העברת פונקציות הפתיחה ל-Sidebar */}
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                    onOpenFolderModal={() => setActiveModal('folder')}
                    onOpenFileModal={() => setActiveModal('file')}
                />
                
                <main className="main-content">
                    <h2 className="content-title">{activeTab}</h2>
                    
                    {/* תצוגת הקבצים (זמנית - רשימה פשוטה) */}
                    {files.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                            {files.map(file => (
                                <div key={file.id} style={{ 
                                    padding: '20px', 
                                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white', 
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ fontSize: '2rem' }}>{file.type === 'folder' ? '📁' : '📄'}</div>
                                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>{file.name}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:'100px', opacity:0.6 }}>
                            <span style={{fontSize:'4rem'}}>🌊</span>
                            <h3>No files in this depth</h3>
                            <p>Use the "New Dive" button to create a folder.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* המודל ליצירת תיקייה */}
            <CreateFolderModal 
                isOpen={activeModal === 'folder'}
                onClose={() => setActiveModal(null)}
                onCreate={handleCreateFolder}
            />
        </div>
    );
};

export default DashboardPage;