/* eslint-disable react/jsx-key */
import useSWR from 'swr';
import { Heading, VStack, Box, Spinner, Text, Center } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React from 'react';
import { PrismaClient, Recipient } from '@prisma/client';
import { NextIronServerSideContext } from '@/utils/session';
import { withRecipientAuthPage } from '@/utils/middlewares/auth';
import { SessionRecipientUser } from '../api/recipients/login';
import SupplyRequestList from '@/components/SupplyRequestList';
import { GetSupplyRequestsResponse } from '../api/recipients/[recId]/supply-requests';

interface RecipientDashboardProps {
  user: SessionRecipientUser;
  recipient: Recipient;
  recipientError?: string;
}

export default function RecipientMapPage({
  recipient,
  recipientError,
}: RecipientDashboardProps) {
  const { data, error } = useSWR<GetSupplyRequestsResponse>(
    recipient ? `/api/recipients/${recipient.id}/supply-requests` : null,
  );
  const isLoading = !data;

  return (
    <VStack w="full" spacing={10} justifyContent="left">
      <Heading>Supply Requests</Heading>
      {recipientError && <Text>{recipientError}</Text>}
      <Box m={24} w="80%">
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <SupplyRequestList data={data.items} />
        )}
      </Box>
    </VStack>
  );
}

export const getServerSideProps: GetServerSideProps<RecipientDashboardProps> =
  withRecipientAuthPage(async ({ req }: NextIronServerSideContext) => {
    const user = req.session.get('user') as SessionRecipientUser;

    let recipient: Recipient | null;
    let recipientError = '';
    try {
      const prisma = new PrismaClient();
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
