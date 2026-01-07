/* client/src/components/RenameModal.js */
import React, { useState, useEffect } from 'react';
import '../styles/modal.css';
import { Icons } from '../utils/Icons';

const RenameModal = ({ isOpen, onClose, onRename, currentFile }) => {
    const [newName, setNewName] = useState('');

    /* Populate the input field with the current name when the modal opens */
    useEffect(() => {
        if (isOpen && currentFile) {
            setNewName(currentFile.name);
        }
    }, [isOpen, currentFile]);

    const handleSubmit = () => {
        /* Only trigger rename if the name has changed and is not empty */
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
            {/* stopPropagation prevents modal closure when clicking inside the content box */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3><Icons.Rename/> Rename</h3>
                
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