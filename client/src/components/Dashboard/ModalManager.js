import React from 'react';
import RenameModal from '../RenameModal';
import CreateFolderModal from '../CreateFolderModal';
import CreateFileModal from '../CreateFileModal';
import MoveFileModal from '../MoveFileModal';
import PermissionsModal from '../PermissionsModal';

const ModalManager = ({ activeModal, setActiveModal, handlers, data }) => {
    return (
        <>
            <RenameModal 
                isOpen={activeModal === 'rename'} 
                onClose={() => setActiveModal(null)} 
                onRename={handlers.handleRenameFile} 
                currentFile={data.fileToRename} 
            />
            <CreateFolderModal 
                isOpen={activeModal === 'folder'} 
                onClose={() => setActiveModal(null)} 
                onCreate={handlers.handleCreateFolder} 
            />
            <CreateFileModal 
                isOpen={activeModal === 'textFile'} 
                onClose={() => setActiveModal(null)} 
                onCreate={handlers.handleCreateTextFile} 
            />
            <MoveFileModal 
                isOpen={activeModal === 'move'} 
                onClose={() => setActiveModal(null)} 
                onMove={handlers.handleMoveConfirm} 
                currentFile={data.fileToMove} 
            />
            <PermissionsModal 
                isOpen={activeModal === 'permissions'} 
                onClose={() => setActiveModal(null)} 
                onSave={handlers.handleSavePermissions} 
                file={data.fileToManagePerms} 
                currentUser={data.currentUser} 
            />
        </>
    );
};

export default ModalManager;