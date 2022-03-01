import { Center, Spinner, useDisclosure } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { createContext, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { GetAdminInfoResponse } from '@/pages/api/admin';
import { fetcher } from '@/utils/api';

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
  data: any;
  mutate: any;
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
    data: {},
    mutate: () => {
      throw new Error('Method not implemented');
    },
  });

export const CredentialsModalProvider = ({
  children,
}: CredentialsModalProviderProps) => {
  const { data, error } = useSWR<GetAdminInfoResponse>(`/api/admin`, fetcher);
  const { mutate } = useSWRConfig();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModalState, setModalState] = useState<CredentialsModalState>(
    CredentialsModalState.ViewCredential,
  );
  if (!data) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  return (
    <CredentialsModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        currentModalState,
        setModalState,
        data,
        mutate,
      }}
    >
      {children}
    </CredentialsModalContext.Provider>
  );
};
