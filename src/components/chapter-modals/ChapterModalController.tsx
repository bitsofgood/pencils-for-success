import React, { useContext } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ChapterModalContext } from '@/providers/ChapterModalProvider';
import NewChapterModal from './NewChapterModal';
import ViewChapterModal from './ViewChapterModal';
import DeleteChapterModal from './DeleteChapterModal';
import EditChapterModal from './EditChapterModal';

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
    case ModalState.ViewChapter:
      return <ViewChapterModal />;
    case ModalState.EditChapter:
      return <EditChapterModal />;
    case ModalState.DeleteChapter:
      return <DeleteChapterModal />;
    default:
      return (
        <ModalContent>
          <ModalHeader>Chapter</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="5">
            <h1>No Modal created for this action</h1>
          </ModalBody>
        </ModalContent>
      );
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
