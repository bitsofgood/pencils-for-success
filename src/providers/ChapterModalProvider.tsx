import { useDisclosure } from '@chakra-ui/react';
import { createContext, useState } from 'react';

// eslint-disable-next-line no-shadow
export enum ModalState {
  NewChapter,
  ViewChapter,
  EditChapter,
  DeleteChapter,
}

export interface ChapterModalContextProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  currentModalState: ModalState;
  setModalState: (x: ModalState) => void;
  activeChapter: number;
  setActiveChapter: (x: number) => void;
}

export interface ChapterModalProviderProps {
  children: JSX.Element;
}

export const ChapterModalContext = createContext<ChapterModalContextProps>({
  isOpen: false,
  activeChapter: -1,
  currentModalState: ModalState.NewChapter,
  onClose: () => {
    throw new Error('Method not implemented');
  },
  onOpen: () => {
    throw new Error('Method not implemented');
  },

  setModalState: (x: ModalState) => {
    throw new Error('Method not implemented');
  },

  setActiveChapter: (x: number) => {
    throw new Error('Method not implemented');
  },
});

export const ChapterModalProvider = ({
  children,
}: ChapterModalProviderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [currentModalState, setModalState] = useState<ModalState>(
    ModalState.NewChapter,
  );

  return (
    <ChapterModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        currentModalState,
        setModalState,
        activeChapter,
        setActiveChapter,
      }}
    >
      {children}
    </ChapterModalContext.Provider>
  );
};
