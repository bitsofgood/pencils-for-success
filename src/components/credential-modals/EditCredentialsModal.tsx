import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { CredentialsModalContext } from '@/providers/CredentialsModalProvider';
import EditCredentialsAdminForm from './EditCredentialsAdminForm';
import EditCredentialsChapterForm from './EditCredentialsChapterForm';

const EditCredentialsModal = () => {
  const { user } = useContext(CredentialsModalContext);
  return (
    <ModalContent>
      <ModalHeader>Edit Credentials</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb="5" mt="2" textAlign="center">
        {Object.prototype.hasOwnProperty.call(user, 'admin') ? (
          <EditCredentialsAdminForm />
        ) : (
          <EditCredentialsChapterForm />
        )}
      </ModalBody>
    </ModalContent>
  );
};

export default EditCredentialsModal;
