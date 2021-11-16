import { HStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NavbarContainer from './NavbarContainer';

export default function AdminNavbar() {
  const router = useRouter();
  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST',
    }).then(() => {
      router.replace('/');
    });
  };

  return (
    <NavbarContainer>
      <HStack spacing="20px">
        <Button size="sm" variant="outline">
          View Admin Info
        </Button>
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </NavbarContainer>
  );
}
