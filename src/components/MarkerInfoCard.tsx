import {
  Heading,
  Flex,
  Spacer,
  Box,
  Text,
  HStack,
  VStack,
  Img,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';

interface MarkerCardProps {
  recipient: DetailedRecipient;
  isActive?: boolean;
}
interface MarkerDetailsProps {
  recipient: DetailedRecipient;
}
function MarkerDetails({ recipient }: MarkerDetailsProps) {
  return (
    <Box>
      <Box my="2">
        <Text>{recipient.contactName}</Text>
        <Text>{recipient.email}</Text>
        <Text>{recipient.phoneNumber}</Text>
      </Box>
      <Box my="8">
        <Text>{recipient.primaryStreetAddress}</Text>
        {recipient.secondaryStreetAddress && (
          <Text>{recipient.secondaryStreetAddress}</Text>
        )}
        <Text>
          {recipient.city}, {recipient.state} {recipient.postalCode}
        </Text>
      </Box>
    </Box>
  );
}
function MarkerCard({ recipient, isActive }: MarkerCardProps) {
  return (
    <div>
      <HStack p="14" pt="40">
        <Box
          boxShadow="lg"
          borderRadius="lg"
          // cursor="pointer"
          bg="white"
          padding="1"
          fontSize="sm"
          height="500px"
          width="264px"
        >
          <VStack p="5" align="left">
            <div style={{ borderRadius: '5px', overflow: 'hidden' }}>
              <img src="/markerInfoCardImg.png" width="400px" />
            </div>
            <Spacer />
            <Flex>
              <Heading size="sm">{recipient.name}</Heading>
              <Spacer />
            </Flex>
            <Flex>{isActive && <MarkerDetails recipient={recipient} />}</Flex>
          </VStack>
        </Box>
      </HStack>
    </div>
  );
}
export default MarkerCard;
