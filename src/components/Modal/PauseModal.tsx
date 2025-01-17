import React from 'react';
import Modal from './Modal';

interface Props {
  onResume: () => void;
  onClose: () => void;
}

const PauseModal: React.FC<Props> = ({ onResume, onClose }) => {
  return (
    <Modal>
      <div className="modal-header">
        <h4 className="modal-title title-font">Game Paused!</h4>
      </div>
      <div className="modal-body">
        <p>Game is paused. Click resume to continue.</p>
      </div>
      <div className="modal-footer">
        <button onClick={onResume} className="button">
          Resume
        </button>
        <button onClick={onClose} className="button button--secondary">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default PauseModal;
