/* client/src/components/CreateFolderModal.js */
import React, { useState } from 'react';
import '../styles/modal.css';

const CreateFolderModal = ({ isOpen, onClose, onCreate }) => {
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState('');

    /* Return null if modal should not be displayed */
    if (!isOpen) return null;

    const handleSubmit = () => {
    if (!folderName.trim()) {
        setError('Please enter a folder name'); /* */
        return;
    }
    setError(''); /* */
    onCreate(folderName);
    setFolderName('');
    onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation ensures clicks inside the modal don't trigger the overlay's onClose */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Create New Folder</h3>
                {error && <div className="error-bubble">{error}</div>}
                
                <label style={{marginBottom:'8px', fontWeight:'600', color:'#64748b', fontSize:'0.9rem'}}>Name</label>
                <input 
                    type="text" 
                    placeholder="e.g. Ships, Fish..." 
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />

                <div className="modal-actions">
                    <button className="btn-primary" onClick={handleSubmit}>
                        Create
                    </button>
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFolderModal;