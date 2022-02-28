import { useDisclosure } from '@chakra-ui/react';
import { createContext, useState } from 'react';

// eslint-disable-next-line no-shadow
export enum ModalState {
  NewRecipient,
  EditRecipient,
  DeleteRecipient,
}

export interface RecipientModalContextProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  currentModalState: ModalState;
  setModalState: (x: ModalState) => void;
  activeRecipient: number;
  setActiveRecipient: (id: number) => void;
}

export interface RecipientModalProviderProps {
  children: JSX.Element;
}

export const RecipientModalContext = createContext<RecipientModalContextProps>({
  isOpen: false,
  activeRecipient: -1,
  currentModalState: ModalState.NewRecipient,
  onClose: () => {
    throw new Error('Method not implemented');
  },
  onOpen: () => {
    throw new Error('Method not implemented');
  },
  setModalState: (x: ModalState) => {
    throw new Error('Method not implemented');
  },
  setActiveRecipient: (x: number) => {
    throw new Error('Method not implemented');
  },
});

export const RecipientModalProvider = ({
  children,
}: RecipientModalProviderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeRecipient, setActiveRecipient] = useState<number>(0);
  const [currentModalState, setModalState] = useState<ModalState>(
    ModalState.NewRecipient,
  );

  return (
    <RecipientModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        currentModalState,
        setModalState,
        activeRecipient,
        setActiveRecipient,
      }}
    >
      {children}
    </RecipientModalContext.Provider>
  );
};
