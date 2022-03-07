import { useDisclosure } from '@chakra-ui/react';
import { createContext, useState } from 'react';

// eslint-disable-next-line no-shadow
export enum CredentialsModalState {
  ViewCredential,
  EditCredential,
}

export interface CredentialsModalContextProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  currentModalState: CredentialsModalState;
  setModalState: (x: CredentialsModalState) => void;
}

export interface CredentialsModalProviderProps {
  children: JSX.Element;
}

export const CredentialsModalContext =
  createContext<CredentialsModalContextProps>({
    isOpen: false,
    currentModalState: CredentialsModalState.ViewCredential,
    onClose: () => {
      throw new Error('Method not implemented');
    },
    onOpen: () => {
      throw new Error('Method not implemented');
    },
    setModalState: (x: CredentialsModalState) => {
      throw new Error('Method not implemented');
    },
  });

export const CredentialsModalProvider = ({
  children,
}: CredentialsModalProviderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModalState, setModalState] = useState<CredentialsModalState>(
    CredentialsModalState.ViewCredential,
  );
  return (
    <CredentialsModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        currentModalState,
        setModalState,
      }}
    >
      {children}
    </CredentialsModalContext.Provider>
  );
};
