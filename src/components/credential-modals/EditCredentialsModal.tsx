import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';
import EditCredentialsForm from './EditCredentialsForm';

const EditChapterModal = () => (
  <ModalContent>
    <ModalHeader>Edit Credentials</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb="5" mt="2" textAlign="center">
      <EditCredentialsForm />
    </ModalBody>
  </ModalContent>
);

export default EditChapterModal;
