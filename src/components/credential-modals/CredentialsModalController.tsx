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
  CredentialsModalContext,
  CredentialsModalState,
} from '@/providers/CredentialsModalProvider';
import ViewCredentialsModal from './ViewCredentialsModal';
import EditCredentialsModal from './EditCredentialsModal';

interface CredentialsModalContentProps {
  state: CredentialsModalState;
}

const CredentialsModalContent = ({ state }: CredentialsModalContentProps) => {
  switch (state) {
    case CredentialsModalState.ViewCredential:
      return <ViewCredentialsModal />;
    case CredentialsModalState.EditCredential:
      return <EditCredentialsModal />;
    default:
      return (
        <ModalContent>
          <ModalHeader>Edit Credentials</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="5">
            <h1>No Modal created for this action</h1>
          </ModalBody>
        </ModalContent>
      );
  }
};

const CredentialsModalController = () => {
  const { isOpen, onClose, currentModalState } = useContext(
    CredentialsModalContext,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <CredentialsModalContent state={currentModalState} />
    </Modal>
  );
};

export default CredentialsModalController;
