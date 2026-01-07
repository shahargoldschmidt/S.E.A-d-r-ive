/* client/src/components/CreateFileModal.js */
import React, { useState } from 'react';
import '../styles/modal.css';

const CreateFileModal = ({ isOpen, onClose, onCreate }) => {
    const [fileName, setFileName] = useState('');
    const [content, setContent] = useState('');
    // If the modal is not open, do not render anything
    if (!isOpen) return null;

    const handleSubmit = () => {
        if (fileName.trim()) {
            const finalName = fileName.includes('.') ? fileName : `${fileName}.txt`;
            onCreate(finalName, content);
            setFileName('');
            setContent('');
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{width: '550px'}} onClick={(e) => e.stopPropagation()}>
                <h3>Create New File</h3>

                <div style={{display:'flex', gap:'15px', width: '100%'}}>
                    <div style={{flex: 1}}>
                        <label style={{marginBottom:'6px', display:'block', fontWeight:'600', color:'#64748b', fontSize:'0.9rem'}}>Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter file name..." 
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>

                </div>

                <label style={{marginBottom:'6px', display:'block', fontWeight:'600', color:'#64748b', fontSize:'0.9rem'}}>Content</label>
                <textarea 
                    rows="5" 
                    placeholder="Start typing content..." 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{resize: 'vertical', minHeight: '100px'}}
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

export default CreateFileModal;