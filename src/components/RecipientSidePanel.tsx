import { Heading, Box, Button } from '@chakra-ui/react';
import { useContext } from 'react';

import {
  ModalState,
  RecipientModalContext,
} from '@/providers/RecipientModalProvider';

interface RecipientDetailsProps {
  id: number;
  recipientName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
}

function RecipientSidePanel({
  id,
  recipientName,
  contactName,
  email,
  phoneNumber,
  streetAddress,
  city,
  state,
  postalCode,
}: RecipientDetailsProps) {
  const { setModalState, setActiveRecipient, onOpen } = useContext(
    RecipientModalContext,
  );

  const openEditRecipientModal = () => {
    setActiveRecipient(id);
    setModalState(ModalState.EditRecipient);
    onOpen();
  };

  return (
    <Box
      bgColor="white"
      py={8}
      px={10}
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      height="fit-content"
    >
      {/* <Image
            borderRadius="md"
            boxSize="220px"
            objectFit="cover"
            src=".../public/logo.png"
            // fallbackSrc="https://via.placeholder.com/150"
            // src='https://bit.ly/dan-abramov'
            alt="School Image"
          /> */}
      <Heading size="md" mb="32px">
        {recipientName}
      </Heading>
      <Heading size="sm">Contact Information</Heading>
      <Heading size="s" fontWeight={3}>
        {contactName}
      </Heading>
      <Heading size="s" fontWeight={3}>
        {email}
      </Heading>
      <Heading size="s" fontWeight={3}>
        {phoneNumber}
      </Heading>

      <Heading size="s" mt="8">
        Address
      </Heading>
      <Heading size="s" fontWeight={3}>
        {streetAddress},
      </Heading>
      <Heading size="s" fontWeight={3}>
        {city}, {state}, {postalCode}
      </Heading>
      <Button
        colorScheme="blue"
        size="lg"
        variant="outline"
        border="2px"
        mt="8"
        width="100%"
        onClick={openEditRecipientModal}
      >
        Edit Info
      </Button>
    </Box>
  );
}

export default RecipientSidePanel;
