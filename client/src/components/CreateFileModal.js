/* client/src/components/CreateFileModal.js */
import React, { useState } from 'react';
import '../styles/modal.css';

const CreateFileModal = ({ isOpen, onClose, onCreate }) => {
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('txt');
    const [content, setContent] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (fileName.trim()) {
            const finalName = fileName.includes('.') ? fileName : `${fileName}.${fileType}`;
            onCreate(finalName, content);
            setFileName('');
            setContent('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{width: '550px'}} onClick={(e) => e.stopPropagation()}>
                <h3>Create New File</h3>

                <div style={{display:'flex', gap:'15px', width: '100%'}}>
                    <div style={{flex: 3}}>
                        <label style={{marginBottom:'6px', display:'block', fontWeight:'600', color:'#64748b', fontSize:'0.9rem'}}>Name</label>
                        <input 
                            type="text" 
                            placeholder="File name..." 
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <label style={{marginBottom:'6px', display:'block', fontWeight:'600', color:'#64748b', fontSize:'0.9rem'}}>Type</label>
                        <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                            <option value="txt">.txt</option>
                            <option value="md">.md</option>
                            <option value="js">.js</option>
                            <option value="py">.py</option>
                            <option value="html">.html</option>
                        </select>
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
                </div>
            </div>
        </div>
    );
};

export default CreateFileModal;