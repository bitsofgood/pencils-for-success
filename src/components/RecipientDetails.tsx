import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { IoIosSchool } from 'react-icons/io';

function RecipientDetails() {
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

export default RecipientDetails;
