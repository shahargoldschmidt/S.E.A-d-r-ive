/* client/src/components/CreateFileModal.js */
import React, { useState } from 'react';
import '../styles/modal.css';

const CreateFileModal = ({ isOpen, onClose, onCreate }) => {
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('txt'); 
    const [content, setContent] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (fileName.trim()) {
            const finalName = `${fileName}.${fileType}`;
            onCreate(finalName, content);
            setFileName('');
            setContent('');
            setFileType('txt');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{width: '500px'}}>
                <h3>Create New File</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{display: 'flex', gap: '10px'}}>
                        <div style={{flex: 2}}>
                            <label>File Name</label>
                            <input 
                                type="text" 
                                value={fileName} 
                                onChange={(e) => setFileName(e.target.value)} 
                                placeholder="Name..."
                                autoFocus
                                required
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <label>Type</label>
                            <select 
                                value={fileType} 
                                onChange={(e) => setFileType(e.target.value)}
                                style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem'}}
                            >
                                <option value="txt">.txt</option>
                                <option value="doc">.doc</option>
                                <option value="pdf">.pdf</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea 
                            rows="8"
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Write content..."
                            style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'monospace'}}
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

export default CreateFileModal;