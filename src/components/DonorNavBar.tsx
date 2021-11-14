import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NavBar from '@/components/NavBar';

export default function DonorNavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex justifyContent="flex-end">
        <NavBar />

        <Box bg="#0A5093" w={200} paddingRight="1100px" />

        <Flex
          w="100%"
          h={20}
          flex-direction="column"
          align-items="flex-end"
          backgroundColor="#0A5093"
          paddingRight="20px"
        >
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack as="nav" spacing={2} display={{ base: 'none', md: 'flex' }}>
            <Menu>
              <MenuButton
                color="white"
                fontWeight="bold"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                Select Chapter
              </MenuButton>
              <MenuList>
                <MenuItem>Georgia</MenuItem>
                <MenuDivider />
                <MenuItem>Texas</MenuItem>
                <MenuDivider />
                <MenuItem>Kansas</MenuItem>
              </MenuList>
            </Menu>

            {/* <HStack as="nav" spacing={2} display={{ base: 'none', md: 'flex' }}> */}
            <Link
              borderWidth={3}
              borderColor="white"
              color="white"
              fontWeight="bold"
              px={2}
              py={1}
              rounded="md"
              _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
              }}
              href="/recipients/login"
            >
              Recipient Login
            </Link>

            <Link
              borderWidth={3}
              borderColor="white"
              color="white"
              fontWeight="bold"
              px={2}
              py={1}
              rounded="md"
              _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
              }}
              href="/chapters/login"
            >
              Chapter Login
            </Link>
          </HStack>
        </Flex>
      </Flex>
    </>
  );
}
