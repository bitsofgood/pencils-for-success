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
  AdminModalContext,
  AdminModalState,
} from '@/providers/AdminModalProvider';
import ViewAdminInfoModal from './ViewAdminInfoModal';
import EditAdminModal from './EditAdminModal';

interface AdminModalContentProps {
  state: AdminModalState;
}

const AdminModalContent = ({ state }: AdminModalContentProps) => {
  switch (state) {
    case AdminModalState.ViewAdmin:
      return <ViewAdminInfoModal />;
    case AdminModalState.EditAdmin:
      return <EditAdminModal />;
    default:
      return (
        <ModalContent>
          <ModalHeader>Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="5">
            <h1>No Modal created for this action</h1>
          </ModalBody>
        </ModalContent>
      );
  }
};

const AdminModalController = () => {
  const { isOpen, onClose, currentModalState } = useContext(AdminModalContext);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <AdminModalContent state={currentModalState} />
    </Modal>
  );
};

export default AdminModalController;
