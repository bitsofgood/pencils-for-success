import React from 'react';
import { Box } from '@chakra-ui/react';

export default function RecipientSidePanel() {
  return (
    <Box h="full" pt="70px" pl="40px">
      <Box
        borderRadius="md"
        borderWidth="2px"
        borderColor="grey"
        bg="white"
        color="white"
        w={352}
      >
        <Box pl="28px" pt="20px">
          <Box borderRadius="md" bg="#BBDEFF" color="blue" w={292} h={170} />
        </Box>
        <Box pt="20px">
          <div
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: '24px',
              textAlign: 'left',
              paddingLeft: '10%',
            }}
          >
            <h1>Georgia School #1</h1>
          </div>
          <br />
          <div
            style={{
              color: 'black',
              textAlign: 'left',
              paddingLeft: '10%',
            }}
          >
            <h1>
              John Smith
              <br />
              johnsmith@gmail.com
              <br />
              404-867-5309
            </h1>
            <br />
            <p>
              675 Ponce De Leon Ave
              <br /> NE, Atlanta, GA 30308
            </p>
          </div>
          <br />
          <br />
        </Box>
        <Box pl="125px" pt="200px" pb="25px">
          <Box
            as="button"
            borderRadius="md"
            borderWidth="2px"
            borderColor="#0A5093"
            bg="white"
            color="#0A5093"
            px={4}
            h={12}
            w={24}
          >
            Edit Info
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
