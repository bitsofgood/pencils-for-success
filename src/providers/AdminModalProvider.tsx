import { useDisclosure } from '@chakra-ui/react';
import { createContext, useState } from 'react';

// eslint-disable-next-line no-shadow
export enum AdminModalState {
  ViewAdmin,
  EditAdmin,
}

export interface AdminModalContextProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  currentModalState: AdminModalState;
  setModalState: (x: AdminModalState) => void;
}

export interface AdminModalProviderProps {
  children: JSX.Element;
}

export const AdminModalContext = createContext<AdminModalContextProps>({
  isOpen: false,
  currentModalState: AdminModalState.ViewAdmin,
  onClose: () => {
    throw new Error('Method not implemented');
  },
  onOpen: () => {
    throw new Error('Method not implemented');
  },
  setModalState: (x: AdminModalState) => {
    throw new Error('Method not implemented');
  },
});

export const AdminModalProvider = ({ children }: AdminModalProviderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModalState, setModalState] = useState<AdminModalState>(
    AdminModalState.ViewAdmin,
  );

  return (
    <AdminModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        currentModalState,
        setModalState,
      }}
    >
      {children}
    </AdminModalContext.Provider>
  );
};
