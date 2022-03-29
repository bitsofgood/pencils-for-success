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
  RecipientModalContext,
  ModalState,
} from '@/providers/RecipientModalProvider';
import DeleteRecipientModal from './DeleteRecipientModal';
import EditRecipientModal from './EditRecipientModal';

interface RecipientModalContentProps {
  state: ModalState;
}

const RecipientModalContent = ({ state }: RecipientModalContentProps) => {
  switch (state) {
    case ModalState.EditRecipient:
      return <EditRecipientModal />;
    case ModalState.DeleteRecipient:
      return <DeleteRecipientModal />;
    default:
      return (
        <ModalContent>
          <ModalHeader>Recipient</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="5">
            <h1>No Modal created for this action</h1>
          </ModalBody>
        </ModalContent>
      );
  }
};

const RecipientModalController = () => {
  const { isOpen, onClose, currentModalState } = useContext(
    RecipientModalContext,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <RecipientModalContent state={currentModalState} />
    </Modal>
  );
};

export default RecipientModalController;
