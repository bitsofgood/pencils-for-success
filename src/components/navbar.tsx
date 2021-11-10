import { Flex } from '@chakra-ui/react';

const h1Styles: CSS.Properties = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '20px',
};

export default function NavBar() {
  // eslint-disable-next-line react/destructuring-assignment
  return (
    <div>
      <Flex
        backgroundColor="#0A5093"
        // spacing={1000}
        w="100%"
        h={20}
        alignItems="center"
        paddingLeft="5%"
      >
        <h1 style={h1Styles}>Pencils for Success</h1>
      </Flex>
    </div>
  );
}
