import {
  Heading,
  Flex,
  Spacer,
  Box,
  Text,
  UnorderedList,
  ListItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Stack,
  Divider,
  Button,
  IconButton,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import {
  BsThreeDots,
  BsPencilFill,
  BsFillTrashFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';
import {
  RecipientModalContext,
  ModalState,
} from '@/providers/RecipientModalProvider';

interface RecipientCardProps {
  recipient: DetailedRecipient;
  isActive?: boolean;
  onClick: (id: number) => void;
}

interface RecipientDetailsProps {
  recipient: DetailedRecipient;
}

function RecipientDetails({ recipient }: RecipientDetailsProps) {
  return (
    <Box>
      <Box mt="4">
        <Heading size="sm">Contact Information</Heading>
        <Text>{recipient.contactName}</Text>
        <Text>{recipient.email}</Text>
        <Text>{recipient.phoneNumber}</Text>
      </Box>

      <Box mt="4">
        <Heading size="sm">Address</Heading>
        <Text>{recipient.primaryStreetAddress}</Text>
        {recipient.secondaryStreetAddress && (
          <Text>{recipient.secondaryStreetAddress}</Text>
        )}
        <Text>
          {recipient.city}, {recipient.state} {recipient.postalCode}
        </Text>
      </Box>

      <Box mt="4">
        <Heading size="sm">Username</Heading>
        <Text>{recipient?.recipientUser?.user?.username}</Text>
      </Box>
    </Box>
  );
}

function SupplyRequestStatus({ recipient }: RecipientDetailsProps) {
  const pendingRequests = recipient.supplyRequests?.filter(
    (x) => x.status === 'PENDING',
  ).length;

  const statusColor = (pendingRequests ?? 0) > 0 ? '#CA9000' : '#858585';

  return (
    <UnorderedList color={statusColor}>
      <ListItem>{pendingRequests} Pending</ListItem>
    </UnorderedList>
  );
}

function RecipientContextMenu({ recipient }: RecipientDetailsProps) {
  const { onOpen, setModalState, setActiveRecipient } = useContext(
    RecipientModalContext,
  );

  const onDeleteRecipient = () => {
    setActiveRecipient(recipient.id);
    setModalState(ModalState.DeleteRecipient);
    onOpen();
  };

  const onEditRecipient = () => {
    setActiveRecipient(recipient.id);
    setModalState(ModalState.EditRecipient);
    onOpen();
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          aria-label="Recipient Actions"
          icon={<BsThreeDotsVertical />}
          _focus={{
            outline: 'none',
            boxShadow: 'none',
          }}
        />
      </PopoverTrigger>
      <PopoverContent width="200px">
        <PopoverArrow />
        <PopoverBody width="200px">
          <Stack>
            <Button
              fontWeight="normal"
              variant="ghost"
              color="gray.700"
              alignItems="center"
              justifyContent="flex-start"
              fontSize="md"
              padding="3"
              onClick={onEditRecipient}
            >
              <BsPencilFill />
              <Text marginLeft={4}>Edit Recipient</Text>
            </Button>

            <Button
              fontWeight="normal"
              variant="ghost"
              color="red"
              alignItems="center"
              justifyContent="flex-start"
              fontSize="md"
              padding="3"
              onClick={onDeleteRecipient}
            >
              <BsFillTrashFill />
              <Text marginLeft={4}>Delete Recipient</Text>
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function RecipientCard({ recipient, onClick, isActive }: RecipientCardProps) {
  return (
    <Box
      boxShadow="lg"
      borderRadius="lg"
      cursor="pointer"
      bg="white"
      pt="4"
      pb="4"
      pl="4"
      pr="4"
      onClick={() => onClick(recipient.id)}
      fontSize="sm"
    >
      <Flex alignItems="flex-start">
        <Heading size="sm" paddingTop="2" marginRight="2" mb="0">
          {recipient.name}
        </Heading>
        <Spacer />
        <RecipientContextMenu recipient={recipient} />
      </Flex>
      <SupplyRequestStatus recipient={recipient} />

      {isActive && <RecipientDetails recipient={recipient} />}
    </Box>
  );
}

export default RecipientCard;
