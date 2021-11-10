import { Box, Heading } from '@chakra-ui/react';
import { Recipient } from '@prisma/client';
import React, { useContext } from 'react';
import { IoIosSchool } from 'react-icons/io';
import { RecipientsContext } from '@/providers/RecipientsProvider';

interface RecipientDetailsProps {
  recipientId: number;
}

function getActiveRecipient(recipientId: number, recipients: Recipient[]) {
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
        minH="500px"
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
    <Box bg="white" minH="500px" boxShadow="lg" borderRadius="lg" p="5">
      <Heading>Supply Requests</Heading>
      {activeRecipient.name}
    </Box>
  );
}

export default RecipientDetails;
