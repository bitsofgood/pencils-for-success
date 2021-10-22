import React, { useContext } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { ChapterModalContext } from '@/providers/ChapterModalProvider';
import NewChapterModal from './NewChapterModal';

// eslint-disable-next-line no-shadow
export enum ModalState {
  NewChapter,
  ViewChapter,
  EditChapter,
  DeleteChapter,
}

interface ChapterModalContentProps {
  state: ModalState;
}

const ChapterModalContent = ({ state }: ChapterModalContentProps) => {
  switch (state) {
    case ModalState.NewChapter:
      return <NewChapterModal />;
    default:
      return <h1>No Modal created for this state</h1>;
  }
};

const ChapterModalController = () => {
  const { isOpen, onClose, currentModalState } =
    useContext(ChapterModalContext);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ChapterModalContent state={currentModalState} />
    </Modal>
  );
};

export default ChapterModalController;
