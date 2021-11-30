/* eslint-disable react/jsx-key */
import useSWR from 'swr';
import {
  Heading,
  Grid,
  Box,
  Spinner,
  Text,
  Center,
  Flex,
  Stack,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { GetServerSideProps } from 'next';
import React from 'react';
import { Recipient } from '@prisma/client';
import { NextIronServerSideContext } from '@/utils/session';
import { withRecipientAuthPage } from '@/utils/middlewares/auth';
import { SessionRecipientUser } from '../api/recipients/login';
import SupplyRequestList from '@/components/SupplyRequestList';
import { GetSupplyRequestsResponse } from '../api/recipients/[recId]/supply-requests';
import RecipientNavbar from '@/components/navbars/RecipientNavbar';
import { NAVBAR_HEIGHT } from '@/styles/theme';
import NewSupplyRequestModal from '@/components/NewSupplyRequestModal';
import prisma from '@/prisma-client';

interface RecipientDashboardProps {
  user: SessionRecipientUser;
  recipient?: Recipient;
  recipientError?: string;
}

export default function RecipientMapPage({
  recipient,
  recipientError,
}: RecipientDashboardProps) {
  // TODO: handle error
  // TODO: properly handle recipient null case
  const { data, error } = useSWR<GetSupplyRequestsResponse>(
    recipient ? `/api/recipients/${recipient.id}/supply-requests` : null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isLoading = !data;

  return (
    <>
      <RecipientNavbar recipientName={recipient?.name || ''} />
      <Box
        p="10"
        background="gray.100"
        position="absolute"
        top={NAVBAR_HEIGHT}
        bottom="0"
        right="0"
        left="0"
      >
        <Grid templateColumns="300px 1fr" my="5" gap="4">
          <Box />
          <Stack
            bgColor="white"
            py={8}
            px={10}
            minH="500px"
            boxShadow="lg"
            borderRadius="lg"
            borderWidth="1px"
            spacing={8}
          >
            <Flex align="center" justifyContent="space-between">
              <Heading>Supply Requests</Heading>
              <Button leftIcon={<BsPlus />} onClick={onOpen}>
                Add New
              </Button>
            </Flex>
            {recipientError && <Text>{recipientError}</Text>}
            {isLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <SupplyRequestList data={data.items} />
            )}
          </Stack>
        </Grid>
      </Box>
      {recipient && (
        <NewSupplyRequestModal
          recipientId={recipient.id}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<RecipientDashboardProps> =
  withRecipientAuthPage(async ({ req, res }: NextIronServerSideContext) => {
    const user = req.session.get('user') as SessionRecipientUser;

    let recipient: Recipient | null;
    let recipientError = '';
    try {
      recipient = await prisma.recipient.findUnique({
        where: {
          id: user.recipient.recipientId,
        },
      });
      if (!recipient) {
        recipientError = 'No recipient found';
      }
    } catch (e) {
      recipient = null;
      recipientError =
        'Failed to retrieve the recipient. Please try again later';
    }

    return {
      props: { user, recipient, recipientError },
    };
  });
