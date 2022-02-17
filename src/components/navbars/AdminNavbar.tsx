import { HStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import NavbarContainer from './NavbarContainer';
import {
  AdminModalContext,
  AdminModalState,
} from '@/providers/AdminModalProvider';

function ViewAdminInfoButton() {
  const { onOpen, setModalState } = useContext(AdminModalContext);

  const onViewAdminInfoClick = () => {
    setModalState(AdminModalState.ViewAdmin);
    onOpen();
  };

  return (
    <Button size="sm" variant="outline" onClick={onViewAdminInfoClick}>
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
        <ViewAdminInfoButton />
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </NavbarContainer>
  );
}
