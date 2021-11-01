import React, { useContext, useEffect, useState } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Spinner,
  Heading,
  Box,
  Button,
  Text,
  Flex,
  Spacer,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { Chapter, User } from '@prisma/client';
import { ChapterModalContext } from '@/providers/ChapterModalProvider';
import { ChaptersContext } from '@/providers/ChaptersProvider';

const getChapterDetails = async (id: number) => {
  const response = await fetch(`/api/chapters/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();
  if (response.status !== 200) {
    throw Error(responseJson.message);
  }

  if (responseJson.error) {
    throw Error(responseJson.message);
  }

  return responseJson.chapter as Chapter;
};

interface ChapterDetailsProps {
  chapter: Chapter;
}

interface UserDetailsProps {
  user?: User;
}

const ChapterDetails = ({ chapter }: ChapterDetailsProps) => (
  <Box>
    <Heading size="md" mb="2">
      Contact Information
    </Heading>

    <Divider />

    <Box my="2">
      <Heading size="xs">Contact Name</Heading>
      <Text>{chapter.contactName}</Text>
    </Box>

    <Box my="2">
      <Heading size="xs">Email</Heading>
      <Text>{chapter.email}</Text>
    </Box>

    <Box my="2">
      <Heading size="xs">Phone Number</Heading>
      <Text>{chapter.phoneNumber}</Text>
    </Box>
  </Box>
);

const UserDetails = ({ user }: UserDetailsProps) => (
  <Box>
    <Heading size="md" mb="2">
      Login Credentials
    </Heading>

    <Divider />

    <Box my="2">
      <Heading size="xs">Username</Heading>
      <Text>{user?.username || 'username'}</Text>
    </Box>
  </Box>
);

const ViewChapterModal = () => {
  const { onClose, activeChapter } = useContext(ChapterModalContext);
  const { chapters, upsertChapter } = useContext(ChaptersContext);

  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    if (activeChapter >= 0) {
      setLoading(true);
      setCurrentChapter(null);
      if (activeChapter in chapters) {
        setCurrentChapter(chapters[activeChapter]);
        setLoading(false);
      } else {
        getChapterDetails(activeChapter)
          .then((chapter) => {
            upsertChapter(chapter);
            setCurrentChapter(chapter);
          })
          .catch((err) => alert(err))
          .finally(() => setLoading(false));
      }
    }
  }, [activeChapter, chapters, upsertChapter]);

  const onEditClick = () => {
    // TODO - Open Edit Modal for the active chapter
    onClose();
  };

  const onDeleteClick = () => {
    // TODO - Open delete confirmation modal for the active chapter
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>{currentChapter?.chapterName || 'Chapter'}</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb="5">
        {loading && <Spinner />}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="5">
          {currentChapter && <ChapterDetails chapter={currentChapter} />}
          {currentChapter && <UserDetails />}
        </SimpleGrid>
        <Divider my="5" />
        <Flex>
          <Button
            colorScheme="blue"
            disabled={!currentChapter}
            onClick={onEditClick}
          >
            Edit Chapter
          </Button>
          <Spacer />
          <Button
            variant="outline"
            colorScheme="blue"
            disabled={!currentChapter}
            onClick={onDeleteClick}
          >
            Delete Chapter
          </Button>
        </Flex>
      </ModalBody>
    </ModalContent>
  );
};

export default ViewChapterModal;
