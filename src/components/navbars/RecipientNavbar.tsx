import { HStack, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NavbarContainer from './NavbarContainer';

interface ChapterNavbarProps {
  recipientName: string;
}

export default function ChapterNavbar({
  recipientName,
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
        <Text fontWeight="bold">{recipientName}</Text>
        <Button size="sm" variant="outline">
          View Chapter Info
        </Button>
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </NavbarContainer>
  );
}
