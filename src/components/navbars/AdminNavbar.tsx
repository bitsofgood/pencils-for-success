import { HStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import NavbarContainer from './NavbarContainer';
import {
  CredentialsModalContext,
  CredentialsModalState,
} from '@/providers/CredentialsModalProvider';

function ViewCredentialInfoButton() {
  const { onOpen, setModalState } = useContext(CredentialsModalContext);

  const onViewCredentialInfoClick = () => {
    setModalState(CredentialsModalState.ViewCredential);
    onOpen();
  };

  return (
    <Button size="sm" variant="outline" onClick={onViewCredentialInfoClick}>
      View Admin Info
    </Button>
  );
}

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
        <ViewCredentialInfoButton />
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </NavbarContainer>
  );
}
