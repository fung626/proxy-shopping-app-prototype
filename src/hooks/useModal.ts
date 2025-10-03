import { ModalContext } from '@/components/modal/ModalProvider';
import { useContext } from 'react';

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
