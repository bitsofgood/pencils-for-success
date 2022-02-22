import React, { useContext } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Recipient } from '@prisma/client';
import {
  SupplyRequestModalContext,
  ModalState,
} from '@/providers/SupplyRequestModalProvider';
import DeleteSupplyRequestModal from './DeleteSupplyRequestModal';

interface SupplyRequestModalContentProps {
  state: ModalState;
}

const SupplyRequestModalContent = ({
  state,
}: SupplyRequestModalContentProps) => {
  switch (state) {
    // Add edit case here
    case ModalState.DeleteSupplyRequest:
      return <DeleteSupplyRequestModal />;
    default:
      return (
        <ModalContent>
          <ModalHeader>SupplyRequest</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="5">
            <h1>No Modal created for this action</h1>
          </ModalBody>
        </ModalContent>
      );
  }
};

const SupplyRequestModalController = () => {
  const { isOpen, onClose, currentModalState } = useContext(
    SupplyRequestModalContext,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <SupplyRequestModalContent state={currentModalState} />
    </Modal>
  );
};

export default SupplyRequestModalController;
