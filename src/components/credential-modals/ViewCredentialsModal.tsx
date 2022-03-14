import React, { useContext } from 'react';
import {
  Box,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import useSWR from 'swr';
import {
  CredentialsModalContext,
  CredentialsModalState,
} from '@/providers/CredentialsModalProvider';
import { fetcher } from '@/utils/api';
import { GetAdminInfoResponse } from '@/pages/api/admin';

const ViewCredentialsModal = () => {
  const { data, error } = useSWR<GetAdminInfoResponse>(`/api/admin`, fetcher);
  const { setModalState } = useContext(CredentialsModalContext);

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
            <Text>{data?.username}</Text>
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
