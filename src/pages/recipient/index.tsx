/* eslint-disable react/jsx-key */
import {
  Heading,
  Grid,
  Box,
  Text,
  Flex,
  Stack,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import { Recipient } from '@prisma/client';
import { NextIronServerSideContext } from '@/utils/session';
import { withRecipientAuthPage } from '@/utils/middlewares/auth';
import { SessionRecipientUser } from '../api/recipients/login';
import SupplyRequestList from '@/components/SupplyRequestList';
import SupplyRequestModalController from '@/components/supply-request-modals/SupplyRequestModalController';
import { SupplyRequestModalProvider } from '@/providers/SupplyRequestModalProvider';
import RecipientNavbar from '@/components/navbars/RecipientNavbar';
import { NAVBAR_HEIGHT } from '@/styles/theme';
import NewSupplyRequestModal from '@/components/NewSupplyRequestModal';
import RecipientSidePanel from '@/components/RecipientSidePanel';
import prisma from '@/prisma-client';
import { RecipientsProvider } from '@/providers/RecipientsProvider';
import {
  RecipientModalContext,
  RecipientModalProvider,
} from '@/providers/RecipientModalProvider';
import RecipientModalController from '@/components/recipient-modals/RecipientModalController';

interface RecipientDashboardProps {
  user: SessionRecipientUser;
  recipient?: Recipient;
  recipientError?: string;
}

export default function RecipientMapPage({
  recipient,
  recipientError,
}: RecipientDashboardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RecipientNavbar recipientName={recipient?.name || ''} />
      <Box p="10" background="gray.100">
        <RecipientsProvider chapterId={recipient?.chapterId || 0}>
          <RecipientModalProvider>
            <Grid templateColumns="300px 1fr" my="" gap="10">
              <RecipientSidePanel
                id={recipient?.id || 0}
                recipientName={recipient?.name || ''}
                contactName={recipient?.contactName || ''}
                email={recipient?.email || ''}
                phoneNumber={recipient?.phoneNumber || ''}
                streetAddress={recipient?.primaryStreetAddress || ''}
                city={recipient?.city || ''}
                state={recipient?.state || ''}
                postalCode={recipient?.postalCode || ''}
              />
              <SupplyRequestModalProvider>
                <Stack
                  bgColor="white"
                  py={8}
                  px={10}
                  minH="500px"
                  boxShadow="lg"
                  borderRadius="lg"
                  borderWidth="1px"
                >
                  <Flex align="center" justifyContent="space-between">
                    <Heading fontSize="24">Supply Requests</Heading>
                    <Button leftIcon={<BsPlus />} onClick={onOpen}>
                      Add New
                    </Button>
                  </Flex>
                  {recipientError && <Text>{recipientError}</Text>}
                  <SupplyRequestModalController />
                  <SupplyRequestList recipientId={recipient?.id || 0} />
                </Stack>
              </SupplyRequestModalProvider>
            </Grid>
            <RecipientModalController />
          </RecipientModalProvider>
        </RecipientsProvider>
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
