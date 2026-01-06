/* client/src/components/RenameModal.js */
import React, { useState, useEffect } from 'react';
import '../styles/modal.css';

const RenameModal = ({ isOpen, onClose, onRename, currentFile }) => {
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (isOpen && currentFile) {
            setNewName(currentFile.name);
        }
    }, [isOpen, currentFile]);

    const handleSubmit = () => {
        if (newName.trim() && newName !== currentFile.name) {
            onRename(currentFile.id, newName);
            onClose();
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>✏️ Rename</h3>
                
                <label style={{marginBottom:'8px', fontWeight:'600', color:'#64748b', fontSize:'0.9rem'}}>New Name</label>
                <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />

                <div className="modal-actions">
                    <button className="btn-primary" onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default RenameModal;