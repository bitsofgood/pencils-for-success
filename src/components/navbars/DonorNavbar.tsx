import { HStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NavbarContainer from './NavbarContainer';

export default function DonorNavbar() {
  const router = useRouter();
  return (
    <NavbarContainer>
      <HStack spacing="15px">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/recipient/login')}
        >
          Recipient Login
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/chapter/login')}
        >
          Chapter Login
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/admin/login')}
        >
          Admin Login
        </Button>
      </HStack>
    </NavbarContainer>
  );
}
