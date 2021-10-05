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

export default function DonorNavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box px={10}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack as="nav" spacing={2} display={{ base: 'none', md: 'flex' }}>
            <Flex alignItems="center">
              <Menu>
                <MenuButton
                  borderWidth={3}
                  borderColor="black"
                  px={3}
                  py={1}
                  // height="40px"
                  // width="150px"
                  // as="button"}
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
              <HStack
                as="nav"
                spacing={2}
                display={{ base: 'none', md: 'flex' }}
              >
                <Link
                  borderWidth={3}
                  borderColor="black"
                  px={2}
                  py={1}
                  // rounded={'md'}
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
                  borderColor="black"
                  px={2}
                  py={1}
                  // rounded={'md'}
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
          </HStack>
        </Flex>

        {/* {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null} */}
      </Box>
    </>
  );
}
