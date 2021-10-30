import React, { useContext, useState } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Button,
  Text,
  Flex,
  Spacer,
  Divider,
} from '@chakra-ui/react';
import {
  ChapterModalContext,
  ModalState,
} from '@/providers/ChapterModalProvider';
import { ChaptersContext } from '@/providers/ChaptersProvider';

const deleteChapter = async (id: number) => {
  const response = await fetch(`/api/chapters/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();
  if (response.status !== 200) {
    throw Error(responseJson.message);
  }

  if (responseJson.error) {
    throw Error(responseJson.message);
  }

  return responseJson;
};

const DeleteChapterModal = () => {
  const { onClose, activeChapter, setModalState, setActiveChapter } =
    useContext(ChapterModalContext);
  const { chapters, removeChapter } = useContext(ChaptersContext);

  const [loading, setLoading] = useState(false);

  const onConfirmation = () => {
    setLoading(true);
    deleteChapter(activeChapter)
      .then(() => {
        onClose();
        setModalState(ModalState.NewChapter);
        removeChapter(activeChapter);
        setActiveChapter(-1);
      })
      .catch((err) => {
        alert(err);
        setModalState(ModalState.ViewChapter);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const chapterToDelete = chapters[activeChapter];

  const onCancel = () => {
    setModalState(ModalState.ViewChapter);
  };

  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalBody pb="5" mt="5" textAlign="center">
        {/* Add icon to bring attention to user */}
        <Text fontSize="4xl" my="5">
          Are you sure?
        </Text>
        <Text color="gray.500">This action will delete chapter</Text>
        <Text fontSize="3xl">{chapterToDelete?.chapterName}</Text>
        <Text color="gray.500">This action cannot be undone</Text>
        <Divider my="5" />
        <Flex>
          <Button colorScheme="red" disabled={loading} onClick={onConfirmation}>
            Delete
          </Button>
          <Spacer />
          <Button disabled={loading} onClick={onCancel}>
            Cancel
          </Button>
        </Flex>
      </ModalBody>
    </ModalContent>
  );
};

export default DeleteChapterModal;
