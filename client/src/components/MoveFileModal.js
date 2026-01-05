/* client/src/components/MoveFileModal.js */
import React, { useState, useEffect } from 'react';
import { fetchFiles } from '../services/api';
import '../styles/modal.css';

const MoveFileModal = ({ isOpen, onClose, onMove, currentFile }) => {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) loadFolders();
    }, [isOpen]);

    const loadFolders = async () => {
        setIsLoading(true);
        try {
            const allFiles = await fetchFiles();
            const validFolders = allFiles.filter(f => 
                f.type === 'folder' && f.id !== currentFile?.id
            );
            setFolders(validFolders);
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>📂 Move to...</h3>
                <p style={{marginBottom: '20px', opacity: 0.8, fontSize:'1.05rem'}}>
                    Item: <strong>{currentFile?.name}</strong>
                </p>

                <div className="move-options">
                    <div className="folder-item" onClick={() => onMove(null)}>
                        <span style={{fontSize:'1.6rem'}}>🏠</span>
                        <span style={{fontWeight:'600'}}>Home (Root)</span>
                    </div>

                    {isLoading && <div style={{padding:'20px', textAlign:'center'}}>Loading...</div>}

                    {folders.map(folder => (
                        <div key={folder.id} className="folder-item" onClick={() => onMove(folder)}>
                            <span style={{fontSize:'1.6rem'}}>📁</span>
                            <span style={{fontWeight:'500'}}>{folder.name}</span>
                        </div>
                    ))}
                    
                    {!isLoading && folders.length === 0 && (
                        <div style={{padding:'20px', textAlign:'center', opacity:0.6}}>No other folders found.</div>
                    )}
                </div>

                <button className="btn-cancel" onClick={onClose} style={{width:'100%'}}>
                    Cancel
                </button>
            </div>
        </div>
    );
};
export default MoveFileModal;