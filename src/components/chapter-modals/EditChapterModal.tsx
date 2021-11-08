import React, { useContext } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';
import { ChapterModalContext } from '@/providers/ChapterModalProvider';
import { ChaptersContext } from '@/providers/ChaptersProvider';
import EditChapterForm from './EditChapterForm';

const EditChapterModal = () => {
  const { activeChapter } = useContext(ChapterModalContext);
  const { chapters } = useContext(ChaptersContext);

  const chapterToEdit = chapters[activeChapter];

  return (
    <ModalContent>
      <ModalHeader>Edit Chapter {chapterToEdit?.chapterName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb="5" mt="5" textAlign="center">
        <EditChapterForm chapterToEdit={chapterToEdit} />
      </ModalBody>
    </ModalContent>
  );
};

export default EditChapterModal;
