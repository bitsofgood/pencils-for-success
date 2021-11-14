import { Flex } from '@chakra-ui/react';
import { Image } from '@chakra-ui/image';
// import logo from 'src/components/logo 2.png';

const h1Styles: CSS.Properties = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '20px',
};

export default function NavBar() {
  return (
    <div>
      <Flex
        backgroundColor="#0A5093"
        w="250px"
        h={20}
        alignItems="center"
        paddingLeft="20px"
        paddingRight="20px"
      >
        <Image src="/logo 2.png" alt="" />
        <h1 style={h1Styles}>Pencils for Success</h1>
      </Flex>
    </div>
  );
}
