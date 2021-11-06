import React, { useContext } from 'react';
import { GetServerSideProps } from 'next';
import {
  SimpleGrid,
  Heading,
  Text,
  Button,
  Box,
  Flex,
  Spacer,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { Chapter, PrismaClient } from '@prisma/client';
import { withChapterAuthPage } from '@/utils/middlewares/auth';
import { NextIronServerSideContext } from '@/utils/session';
import { SessionChapterUser } from '../api/chapters/login';
import {
  RecipientsContext,
  RecipientsProvider,
} from '@/providers/RecipientsProvider';
import RecipientCard from '@/components/RecipientCard';
import NewRecipientModal from '@/components/recipient-modals/NewRecipientModal';

interface ChapterDashboardProps {
  user: SessionChapterUser;
  chapter: Chapter;
  chapterError?: string;
}

function RecipientsCardsGrid() {
  const { recipients, loading, error } = useContext(RecipientsContext);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} my="5" spacing="5">
      {recipients.map((x) => (
        <RecipientCard recipient={x} key={x.id} />
      ))}
    </SimpleGrid>
  );
}

export default function ChapterDashboardPage({
  user,
  chapter,
  chapterError,
}: ChapterDashboardProps) {
  const { chapterId } = user.chapterUser;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <RecipientsProvider chapterId={chapterId}>
      <Box p="10">
        <Flex>
          <Heading>{chapter?.chapterName} Chapter</Heading>
          <Spacer />
          <Button onClick={onOpen} colorScheme="blue">
            + Add New
          </Button>
        </Flex>

        {chapterError && <Text>{chapterError}</Text>}

        <RecipientsCardsGrid />
        <NewRecipientModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </RecipientsProvider>
  );
}

export const getServerSideProps: GetServerSideProps<ChapterDashboardProps> =
  withChapterAuthPage(async ({ req }: NextIronServerSideContext) => {
    const user = req.session.get('user') as SessionChapterUser;

    let chapter: Chapter | null;
    let chapterError = '';
    try {
      const prisma = new PrismaClient();
      chapter = await prisma.chapter.findUnique({
        where: {
          id: user.chapterUser.chapterId,
        },
      });
      if (!chapter) {
        chapterError = 'No chapter found';
      }
    } catch (e) {
      chapter = null;
      chapterError = 'Failed to retrieve the chapter. Please try again later';
    }

    return {
      props: { user, chapter, chapterError },
    };
  });
