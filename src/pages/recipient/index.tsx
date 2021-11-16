/* eslint-disable react/jsx-key */
import { Heading, VStack, Box } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React from 'react';
import { PrismaClient, Recipient } from '@prisma/client';
import { NextIronServerSideContext } from '@/utils/session';
import { withRecipientAuthPage } from '@/utils/middlewares/auth';
import { SessionRecipientUser } from '../api/recipients/login';
import SupplyRequestList from '@/components/SupplyRequestList';

interface RecipientDashboardProps {
  user: SessionRecipientUser;
  recipient: Recipient;
  recipientError?: string;
}

export default function RecipientMapPage() {
  const data = React.useMemo(
    () => [
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
      {
        itemName: 'Pencils',
        quantity: 25,
        status: 'Pending',
        lastUpdated: '11/6/21',
        created: '11/6/21',
        notes: 'Notes',
      },
    ],
    [],
  );
  return (
    <VStack w="full" spacing={10} justifyContent="left">
      <Heading>Supply Requests</Heading>
      <Box m={24} w="80%">
        <SupplyRequestList data={data} />
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
