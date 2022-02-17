import React, { useContext } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import {
  ChapterModalContext,
  ChapterModalState,
} from '@/providers/ChapterModalProvider';
import NewChapterModal from './NewChapterModal';
import DeleteChapterModal from './DeleteChapterModal';
import EditChapterModal from './EditChapterModal';

interface ChapterModalContentProps {
  state: ChapterModalState;
}

const ChapterModalContent = ({ state }: ChapterModalContentProps) => {
  switch (state) {
    case ChapterModalState.NewChapter:
      return <NewChapterModal />;
    case ChapterModalState.EditChapter:
      return <EditChapterModal />;
    case ChapterModalState.DeleteChapter:
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
