'use client';

import { FC, ReactNode, useEffect, useState } from 'react';

interface ModalWrapperProps {
  children: ReactNode;
  closeModal: () => void;
}

const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  closeModal,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-gray-600 bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className={`transform transition-all duration-300 ease-in-out ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
