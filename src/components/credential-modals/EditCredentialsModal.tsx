import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';
import EditAdminForm from './EditCredentialsForm';

const EditChapterModal = () => (
  <ModalContent>
    <ModalHeader>Edit Admin</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb="5" mt="2" textAlign="center">
      <EditAdminForm />
    </ModalBody>
  </ModalContent>
);

export default EditChapterModal;
