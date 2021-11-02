import React from 'react';
import {
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  Button,
  Text,
  Flex,
  Spacer,
  Divider,
  Modal,
} from '@chakra-ui/react';
import { Chapter } from '@prisma/client';

interface EditConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmation: () => void;
  chapter: Chapter;
}

const EditConfirmationModal = ({
  isOpen,
  onClose,
  chapter,
  onConfirmation,
}: EditConfirmationProps) => {
  const onCancel = () => onClose();
  const onConfirm = () => {
    onConfirmation();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody pb="5" mt="5" textAlign="center">
          <Text fontSize="4xl" my="5">
            Are you sure?
          </Text>
          <Text color="gray.500">This action will update chapter</Text>
          <Text fontSize="3xl">{chapter?.chapterName}</Text>
          <Text color="gray.500">This action cannot be undone</Text>
          <Divider my="5" />
          <Flex>
            <Button colorScheme="blue" onClick={onConfirm}>
              Update
            </Button>
            <Spacer />
            <Button onClick={onCancel}>Cancel</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditConfirmationModal;
