import React from 'react';
import { Icons } from '../../utils/Icons';
import ActionMenu from '../ActionMenu';

const FileTable = ({ files, starredIds, handleItemClick, handleToggleStar, getFileActions, formatDate, formatSize, activeTab }) => (
    <div className="files-table-container">
        <table className="files-table">
            <thead>
                <tr><th>Name</th><th>Owner</th><th>Date</th><th>Size</th><th style={{ width: '100px' }}></th></tr>
            </thead>
            <tbody>
                {files.map(file => {
                    const isStarred = starredIds.has(file.id);
    
                    const displayName = file.name.includes('.') 
                        ? file.name.substring(0, file.name.lastIndexOf('.')) 
                        : file.name;

                    return (
                        <tr key={file.id} onClick={() => handleItemClick(file)} style={{ cursor: 'pointer' }}>
                            <td className="file-name-cell">
                                <span className="file-icon">
                                    {file.type === 'folder' ? <Icons.Folder size={30} /> : file.type === 'image' ? <Icons.Image size={30} /> : <Icons.File size={30} />}
                                </span>
                                {displayName}
                            </td>
                            <td>{file.owner || 'Me'}</td>
                            <td>{formatDate(file.createdAt)}</td>
                            <td>{formatSize(file.size)}</td>
                            <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                {activeTab !== 'Trash' && (
                                    <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleToggleStar(file.id); }} style={{ color: isStarred ? '#f4b400' : '#ccc', marginRight: '5px' }}>
                                        {isStarred ? '★' : '☆'}
                                    </button>
                                )}
                                <ActionMenu actions={getFileActions(file, false)} />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        {files.length === 0 && <div style={{ textAlign: 'center', padding: '50px', opacity: 0.6 }}>No files found</div>}
    </div>
);

export default FileTable;