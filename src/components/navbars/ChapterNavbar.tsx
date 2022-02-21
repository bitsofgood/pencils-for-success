import { useContext } from 'react';
import { HStack, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NavbarContainer from './NavbarContainer';
import {
  CredentialsModalContext,
  CredentialsModalState,
} from '@/providers/CredentialsModalProvider';

// TODO: add view chapter modal
interface ChapterNavbarProps {
  chapterName: string;
  // onViewChapterClick: () => void;
}

function ViewCredentialInfoButton() {
  const { onOpen, setModalState } = useContext(CredentialsModalContext);

  const onViewCredentialInfoClick = () => {
    setModalState(CredentialsModalState.ViewCredential);
    onOpen();
  };

  return (
    <Button size="sm" variant="outline" onClick={onViewCredentialInfoClick}>
      View Chapter Info
    </Button>
  );
}

export default function ChapterNavbar({
  chapterName,
}: // onViewChapterClick,
ChapterNavbarProps) {
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
        <Text fontWeight="bold">{chapterName}</Text>
        <ViewCredentialInfoButton />
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </NavbarContainer>
  );
}
