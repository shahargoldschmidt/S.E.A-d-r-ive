/* client/src/components/CreateFolderModal.js */
import React, { useState } from 'react';
import '../styles/modal.css';

const CreateFolderModal = ({ isOpen, onClose, onCreate }) => {
    const [folderName, setFolderName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (folderName.trim()) {
            onCreate(folderName);
            setFolderName('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Create New Folder</h3>
                
                <label style={{marginBottom:'8px', fontWeight:'600', color:'#64748b', fontSize:'0.9rem'}}>Name</label>
                <input 
                    type="text" 
                    placeholder="e.g. Finance, Photos..." 
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />

                {/* כפתור יחיד ורחב */}
                <div className="modal-actions">
                    <button className="btn-primary" onClick={handleSubmit}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFolderModal;