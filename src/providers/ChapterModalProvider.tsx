import { useDisclosure } from '@chakra-ui/react';
import { createContext, useState } from 'react';

// eslint-disable-next-line no-shadow
export enum ChapterModalState {
  NewChapter,
  EditChapter,
  DeleteChapter,
}

export interface ChapterModalContextProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  currentModalState: ChapterModalState;
  setModalState: (x: ChapterModalState) => void;
  activeChapter: number;
  setActiveChapter: (id: number) => void;
}

export interface ChapterModalProviderProps {
  children: JSX.Element;
}

export const ChapterModalContext = createContext<ChapterModalContextProps>({
  isOpen: false,
  activeChapter: -1,
  currentModalState: ChapterModalState.NewChapter,
  onClose: () => {
    throw new Error('Method not implemented');
  },
  onOpen: () => {
    throw new Error('Method not implemented');
  },
  setModalState: (x: ChapterModalState) => {
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
  const [currentModalState, setModalState] = useState<ChapterModalState>(
    ChapterModalState.NewChapter,
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
