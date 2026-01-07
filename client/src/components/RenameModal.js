/* client/src/components/RenameModal.js */
import React, { useState, useEffect } from 'react';
import '../styles/modal.css';
import { Icons } from '../utils/Icons';

const RenameModal = ({ isOpen, onClose, onRename, currentFile }) => {
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    /* Populate the input field with the current name when the modal opens */
    useEffect(() => {
        if (isOpen && currentFile) {
            setNewName(currentFile.name);
        }
    }, [isOpen, currentFile]);

    const handleSubmit = () => {
    if (!newName.trim()) {
        setError('Please enter a valid name'); /* */
        return;
    }
    if (newName === currentFile.name) {
        onClose();
        return;
    }
    setError(''); /* */
    onRename(currentFile.id, newName);
    onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation prevents modal closure when clicking inside the content box */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3><Icons.Rename/> Rename</h3>
                {error && <div className="error-bubble">{error}</div>}
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