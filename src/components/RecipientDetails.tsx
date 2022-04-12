import { Box, Heading, Stack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { IoIosSchool } from 'react-icons/io';
import { RecipientsContext } from '@/providers/RecipientsProvider';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';
import SupplyRequestList from './SupplyRequestList';
import SupplyRequestModalController from '@/components/supply-request-modals/SupplyRequestModalController';
import { SupplyRequestModalProvider } from '@/providers/SupplyRequestModalProvider';

interface RecipientDetailsProps {
  recipientId: number;
}

function getActiveRecipient(
  recipientId: number,
  recipients: DetailedRecipient[],
) {
  const filteredRecipients = recipients.filter((x) => x.id === recipientId);
  let activeRecipient = null;
  if (filteredRecipients.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    activeRecipient = filteredRecipients[0];
  }
  return activeRecipient;
}

function RecipientDetails({ recipientId }: RecipientDetailsProps) {
  const { recipients } = useContext(RecipientsContext);
  const activeRecipient = getActiveRecipient(recipientId, recipients);

  if (!activeRecipient) {
    return (
      <Box
        w="100%"
        h="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        fontSize="5xl"
        color="gray.600"
      >
        <IoIosSchool />
        <Heading>Select Recipient</Heading>
      </Box>
    );
  }

  return (
    <Box bg="white" boxShadow="lg" borderRadius="lg" px={6} py={6}>
      <SupplyRequestModalProvider>
        <>
          <SupplyRequestModalController />
          <SupplyRequestList recipientId={activeRecipient.id} />
        </>
      </SupplyRequestModalProvider>
    </Box>
  );
}

export default RecipientDetails;
