import { useDisclosure } from '@chakra-ui/react';
import { createContext, useState } from 'react';
import { SessionAdminUser } from '@/pages/api/admin/login';
import { SessionChapterUser } from '@/pages/api/chapters/login';

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
  user: any;
  credentialsData: any;
  setCredentialsData: (x: any) => void;
}

export interface CredentialsModalProviderProps {
  user: SessionAdminUser | SessionChapterUser;
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
    user: null,
    credentialsData: null,
    setCredentialsData: (x: any) => {
      throw new Error('Method not implemented');
    },
  });

export const CredentialsModalProvider = ({
  user,
  children,
}: CredentialsModalProviderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModalState, setModalState] = useState<CredentialsModalState>(
    CredentialsModalState.ViewCredential,
  );
  const [credentialsData, setCredentialsData] = useState(null);
  return (
    <CredentialsModalContext.Provider
      value={{
        user,
        isOpen,
        onOpen,
        onClose,
        currentModalState,
        setModalState,
        credentialsData,
        setCredentialsData,
      }}
    >
      {children}
    </CredentialsModalContext.Provider>
  );
};
