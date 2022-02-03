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
import React, { useState } from 'react';
import { BsThreeDots, BsPencilFill, BsFillTrashFill } from 'react-icons/bs';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';

interface RecipientCardProps {
  recipient: DetailedRecipient;
  isActive?: boolean;
  onClick: (id: number) => void;
}

function RecipientSidePanel() {
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
        <Heading size="sm" color="black">
          HELLOO
        </Heading>
        <Spacer />
      </Flex>
    </Box>
  );
}

export default RecipientSidePanel;
