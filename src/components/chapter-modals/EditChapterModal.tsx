import React, { useContext } from 'react';
import {
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';
import { ChapterModalContext } from '@/providers/ChapterModalProvider';
import { ChaptersContext } from '@/providers/ChaptersProvider';
import EditChapterForm from './EditChapterForm';
import EditCredentialsForm from './EditCredentialsForm';

const EditChapterModal = () => {
  const { activeChapter } = useContext(ChapterModalContext);
  const { chapters } = useContext(ChaptersContext);

  const chapterToEdit = chapters[activeChapter];

  return (
    <ModalContent>
      <ModalHeader>Edit Chapter {chapterToEdit?.chapterName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb="5" mt="5" textAlign="center">
        <EditCredentialsForm chapterToEdit={chapterToEdit} />
        <Divider my="5" />
        <EditChapterForm chapterToEdit={chapterToEdit} />
      </ModalBody>
    </ModalContent>
  );
};

export default EditChapterModal;
