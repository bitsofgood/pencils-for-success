import { Heading, Flex, Spacer, Box, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDots, BsPencilFill, BsFillTrashFill } from 'react-icons/bs';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';

interface RecipientDetailsProps {
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
  recipientName,
  contactName,
  email,
  phoneNumber,
  streetAddress,
  city,
  state,
  postalCode,
}: RecipientDetailsProps) {
  return (
    <Box
      bgColor="white"
      py={8}
      px={10}
      minH="500px"
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      spacing={8}
    >
      <Flex>
        <VStack alignItems="start">
          <Heading size="md" mb="32px">
            {recipientName}
          </Heading>
          <Heading size="xs" fontWeight={3}>
            {contactName}
          </Heading>
          <Heading size="xs" fontWeight={3}>
            {email}
          </Heading>
          <Heading size="xs" fontWeight={3}>
            {phoneNumber}
          </Heading>
          <Spacer />
          <Spacer />
          <Heading size="xs" fontWeight={3}>
            {streetAddress},
          </Heading>
          <Heading size="xs" fontWeight={3}>
            {city}, {state}, {postalCode}
          </Heading>
        </VStack>
        <Spacer />
      </Flex>
    </Box>
  );
}

export default RecipientSidePanel;
