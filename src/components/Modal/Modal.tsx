import React from 'react';

import './styles.scss';

interface Props {
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ children }) => {
  return (
    <div className="modal">
      <div className="modal-content">{children}</div>
    </div>
  );
};

export default Modal;
