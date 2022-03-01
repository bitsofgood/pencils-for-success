import { useDisclosure } from '@chakra-ui/react';
import { User } from '@prisma/client';
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
  username: string;
  setUsername: (x: string) => void;
}

export interface CredentialsModalProviderProps {
  name: string;
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
    username: '',
    setUsername: (x: string) => {
      throw new Error('Method not implemented');
    },
  });

export const CredentialsModalProvider = ({
  children,
  name,
}: CredentialsModalProviderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModalState, setModalState] = useState<CredentialsModalState>(
    CredentialsModalState.ViewCredential,
  );
  const [username, setUsername] = useState<string>(name);

  return (
    <CredentialsModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        currentModalState,
        setModalState,
        username,
        setUsername,
      }}
    >
      {children}
    </CredentialsModalContext.Provider>
  );
};
