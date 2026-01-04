import React, { useState, useEffect } from 'react';
import { fetchFiles } from '../services/api';
import '../styles/modal.css';

const MoveFileModal = ({ isOpen, onClose, onMove, currentFile }) => {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadFolders();
        }
    }, [isOpen]);

    const loadFolders = async () => {
        setIsLoading(true);
        try {
            // טוענים את כל הקבצים ומסננים רק תיקיות
            // הערה: במערכת גדולה היינו עושים קריאת API ייעודית לתיקיות בלבד
            const allFiles = await fetchFiles();
            // מסננים: רק תיקיות, ורק כאלו שאני לא מעביר לתוך עצמן (אם אני מעביר תיקייה)
            const validFolders = allFiles.filter(f => 
                f.type === 'folder' && 
                f.id !== currentFile?.id
            );
            setFolders(validFolders);
        } catch (error) {
            console.error("Failed to load folders", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{width: '500px'}} onClick={e => e.stopPropagation()}>
                <h3>📂 Move "{currentFile?.name}" to...</h3>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto', margin: '20px 0' }}>
                    {isLoading ? (
                        <div style={{textAlign: 'center'}}>Loading folders...</div>
                    ) : (
                        <div className="folders-grid">
                            {/* אפשרות להעביר לתיקייה הראשית */}
                            <div 
                                className="folder-select-item home"
                                onClick={() => onMove(null)} // null = תיקייה ראשית
                            >
                                🏠 Home (Root)
                            </div>

                            {folders.map(folder => (
                                <div 
                                    key={folder.id} 
                                    className="folder-select-item"
                                    onClick={() => onMove(folder)} // מעבירים את כל אובייקט התיקייה
                                >
                                    📁 {folder.name}
                                </div>
                            ))}
                            
                            {folders.length === 0 && (
                                <div style={{opacity: 0.5, textAlign: 'center', padding: '10px'}}>
                                    No other folders found.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default MoveFileModal;