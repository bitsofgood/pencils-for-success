import { Flex } from '@chakra-ui/react';
import Image from 'next/image';

interface NavbarContainerProps {
  children: React.ReactNode;
}

// TODO: make navbar mobile friendly
export default function NavbarContainer({
  children,
  ...props
}: NavbarContainerProps) {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      px={8}
      h="55px"
      bgColor="#0A5093"
      color="white"
      overflow="hidden"
      {...props}
    >
      <Image src="/logo.png" alt="Navbar logo" width="50px" height="40px" />
      {children}
    </Flex>
  );
}
