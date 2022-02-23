import {
  Heading,
  Flex,
  Spacer,
  Box,
  VStack,
  Stack,
  Button,
  Image,
} from '@chakra-ui/react';

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
        <VStack alignItems="start" spacing="12px">
          <Image
            borderRadius="md"
            boxSize="220px"
            objectFit="cover"
            src=".../public/logo.png"
            fallbackSrc="https://via.placeholder.com/150"
            // src='https://bit.ly/dan-abramov'
            alt="School Image"
          />
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
        <Stack position="absolute" bottom="80px" align="center">
          <Button
            ml="50px"
            colorScheme="blue"
            size="lg"
            variant="outline"
            border="2px"
          >
            Edit Info
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}

export default RecipientSidePanel;
