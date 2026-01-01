import React, { useState } from 'react';
import '../styles/modal.css'; // משתמשים ב-CSS הראשי

const CreateFolderModal = ({ isOpen, onClose, onCreate }) => {
    const [folderName, setFolderName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (folderName.trim()) {
            onCreate(folderName);
            setFolderName(''); // איפוס
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Create New Folder</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                            type="text" 
                            value={folderName} 
                            onChange={(e) => setFolderName(e.target.value)} 
                            placeholder="Folder name..."
                            autoFocus
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-create">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFolderModal;