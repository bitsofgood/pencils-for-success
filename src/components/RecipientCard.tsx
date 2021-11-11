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
} from '@chakra-ui/react';
import { Recipient } from '@prisma/client';
import React, { useState } from 'react';
import { BsThreeDots, BsPencilFill, BsFillTrashFill } from 'react-icons/bs';

interface RecipientCardProps {
  recipient: Recipient;
  isActive?: boolean;
  onClick: (id: number) => void;
}

interface RecipientDetailsProps {
  recipient: Recipient;
}

function RecipientDetails({ recipient }: RecipientDetailsProps) {
  return (
    <Box>
      <Box my="2">
        <Heading size="sm">Contact Information</Heading>
        <Text>{recipient.contactName}</Text>
        <Text>{recipient.email}</Text>
        <Text>{recipient.phoneNumber}</Text>
      </Box>

      <Box my="2">
        <Heading size="sm">Address</Heading>
        <Text>{recipient.primaryStreetAddress}</Text>
        {recipient.secondaryStreetAddress && (
          <Text>{recipient.secondaryStreetAddress}</Text>
        )}
        <Text>
          {recipient.city}, {recipient.state} {recipient.postalCode}
        </Text>
      </Box>

      <Box my="2">
        <Heading size="sm">Username</Heading>
        {/* <Text>{recipient?.user.username}</Text> */}
      </Box>
    </Box>
  );
}

function SupplyRequestStatus() {
  // TODO - Fetch this dynamically once implemented
  const [pendingRequests, setPendingRequests] = useState(
    Math.floor(Math.random() * 6),
  );

  const statusColor = pendingRequests > 0 ? '#CA9000' : '#858585';

  return (
    <UnorderedList color={statusColor}>
      <ListItem>{pendingRequests} Pending</ListItem>
    </UnorderedList>
  );
}

function RecipientContextMenu() {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box>
          <BsThreeDots />
        </Box>
      </PopoverTrigger>
      <PopoverContent width="200px">
        <PopoverArrow />
        <PopoverBody width="200px">
          <Stack>
            <Flex color="gray.700">
              <BsPencilFill />
              <Text ml="3">Edit Recipient</Text>
            </Flex>

            <Divider />

            <Flex color="red">
              <BsFillTrashFill />
              <Text ml="3">Delete Recipient</Text>
            </Flex>
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
      padding="5"
      onClick={() => onClick(recipient.id)}
      fontSize="sm"
    >
      <Flex>
        <Heading size="sm">{recipient.name}</Heading>
        <Spacer />
        <RecipientContextMenu />
      </Flex>
      <SupplyRequestStatus />

      {isActive && <RecipientDetails recipient={recipient} />}
    </Box>
  );
}

export default RecipientCard;
