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
import { SessionAdminUser } from '@/pages/api/admin/login';
import { ChapterResponse } from '@/pages/api/chapters/[chapterId]';

const ViewCredentialsModal = () => {
  const { user, setModalState, setCredentialsData } = useContext(
    CredentialsModalContext,
  );
  const { data, error } = useSWR(
    `${
      Object.prototype.hasOwnProperty.call(user, 'admin')
        ? '/api/admin'
        : `/api/chapters/${user?.chapterUser?.chapterId}`
    }`,
    fetcher,
  );

  if (Object.prototype.hasOwnProperty.call(user, 'admin')) {
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
  }

  return (
    <ModalContent>
      <ModalHeader>Credentials</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb="5" mt="5" textAlign="left">
        <Box display="flex" flexDirection="row">
          <Box paddingBottom="48px">
            <Text paddingBottom="16px" fontSize="20px">
              Contact
            </Text>
            <Box display="flex" flexDirection="row">
              <Text paddingRight="8px">Username:</Text>
              <Text fontWeight="bold">{data?.chapter?.contactName}</Text>
            </Box>
            <Box display="flex" flexDirection="row">
              <Text paddingRight="8px">Email:</Text>
              <Text fontWeight="bold">{data?.chapter?.email}</Text>
            </Box>
            <Box display="flex" flexDirection="row">
              <Text paddingRight="8px">Phone Number:</Text>
              <Text fontWeight="bold">{data?.chapter?.phoneNumber}</Text>
            </Box>
          </Box>
          <Box paddingBottom="48px" paddingLeft="48px">
            <Text paddingBottom="16px" fontSize="20px">
              Login Credentials
            </Text>
            <Box display="flex" flexDirection="row">
              <Text paddingRight="8px">Username:</Text>
              <Text fontWeight="bold">
                {data?.chapter?.chapterUser?.user?.username}
              </Text>
            </Box>
          </Box>
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => {
            setCredentialsData(data);
            setModalState(CredentialsModalState.EditCredential);
          }}
        >
          Edit
        </Button>
      </ModalBody>
    </ModalContent>
  );
};

export default ViewCredentialsModal;
