import { useDisclosure } from '@chakra-ui/react';
import { createContext, useState } from 'react';

// eslint-disable-next-line no-shadow
export enum ModalState {
  NewSupplyRequest,
  EditSupplyRequest,
  DeleteSupplyRequest,
}

export interface SupplyRequestModalContextProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  currentModalState: ModalState;
  setModalState: (x: ModalState) => void;
  activeRecipientId: number;
  setActiveRecipientId: (id: number) => void;
  activeSupplyRequestId: number;
  setActiveSupplyRequestId: (id: number) => void;
}

export interface SupplyRequestModalProviderProps {
  children: JSX.Element;
}

export const SupplyRequestModalContext =
  createContext<SupplyRequestModalContextProps>({
    isOpen: false,
    activeSupplyRequestId: -1,
    activeRecipientId: -1,
    currentModalState: ModalState.NewSupplyRequest,
    onClose: () => {
      throw new Error('Method not implemented');
    },
    onOpen: () => {
      throw new Error('Method not implemented');
    },
    setModalState: (x: ModalState) => {
      throw new Error('Method not implemented');
    },
    setActiveSupplyRequestId: (x: number) => {
      throw new Error('Method not implemented');
    },
    setActiveRecipientId: (x: number) => {
      throw new Error('Method not implemented');
    },
  });

export const SupplyRequestModalProvider = ({
  children,
}: SupplyRequestModalProviderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeSupplyRequestId, setActiveSupplyRequestId] = useState<number>(0);
  const [activeRecipientId, setActiveRecipientId] = useState<number>(0);
  const [currentModalState, setModalState] = useState<ModalState>(
    ModalState.NewSupplyRequest,
  );

  return (
    <SupplyRequestModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        currentModalState,
        setModalState,
        activeRecipientId,
        setActiveRecipientId,
        activeSupplyRequestId,
        setActiveSupplyRequestId,
      }}
    >
      {children}
    </SupplyRequestModalContext.Provider>
  );
};
