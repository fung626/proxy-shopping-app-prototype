'use client';

import type { ReactNode } from 'react';
import React, { useCallback, useState } from 'react';

export type ModalProps = {
  closeModal: (param?: PromiseResolvePayload<'CLOSE'>) => void;
};

type PromiseResolvePayload<Action extends string> = {
  action: Action;
};

type ModalContextType = {
  showModal<Props extends ModalProps>(options: {
    component: React.FunctionComponent<Props>;
    props?: Omit<Props, 'closeModal'>;
  }): Promise<
    | NonNullable<Parameters<Props['closeModal']>[0]>
    | PromiseResolvePayload<'CLOSE'>
  >;
  closeModal(data?: PromiseResolvePayload<'CLOSE'>): void;
};

export const ModalContext = React.createContext<
  ModalContextType | undefined
>(undefined);

let modalId = 1;

type Modal = {
  id: number;
  component: React.FunctionComponent<any>;
  props?: { [key: string]: unknown };
  resolve: (data: PromiseResolvePayload<'CLOSE'>) => void;
};

export const ModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [modals, setModals] = useState<Modal[]>([]);

  const showModal = useCallback<ModalContextType['showModal']>(
    ({ component, props }) => {
      return new Promise((resolve) => {
        setModals((prev) => {
          return [
            ...prev,
            { component, props, resolve, id: modalId++ },
          ];
        });
      });
    },
    []
  );

  const closeModal = useCallback<ModalContextType['closeModal']>(
    (data) => {
      setModals((prev) => {
        const newModals = [...prev];
        const lastModal = newModals.pop();
        lastModal?.resolve(data || { action: 'CLOSE' });
        return newModals;
      });
    },
    []
  );

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modals.map((modal) => {
        const Modal = modal.component;
        return (
          <Modal
            key={modal.id}
            {...modal.props}
            closeModal={closeModal}
          />
        );
      })}
    </ModalContext.Provider>
  );
};
