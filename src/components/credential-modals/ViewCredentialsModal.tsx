import React, { useContext } from 'react';
import {
  Box,
  Button,
  Divider,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import {
  CredentialsModalContext,
  CredentialsModalState,
} from '@/providers/CredentialsModalProvider';

const ViewCredentialsModal = () => {
  const { setModalState, username } = useContext(CredentialsModalContext);

  return (
    <ModalContent>
      <ModalHeader>Credentials</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb="5" mt="5" textAlign="left">
        <Box paddingBottom="48px">
          <Text paddingBottom="16px" fontSize="20px">
            Login Credentials
          </Text>
          <Box display="flex" flexDirection="row">
            <Text paddingRight="8px">Username:</Text>
            <Text>{username}</Text>
          </Box>
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => setModalState(CredentialsModalState.EditCredential)}
        >
          Edit
        </Button>
      </ModalBody>
    </ModalContent>
  );
};

export default ViewCredentialsModal;
