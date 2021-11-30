import React, { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  Heading,
  Text,
  Button,
  Box,
  Flex,
  Spacer,
  Spinner,
  useDisclosure,
  Grid,
  Stack,
} from '@chakra-ui/react';
import { Chapter } from '@prisma/client';
import { withChapterAuthPage } from '@/utils/middlewares/auth';
import { NextIronServerSideContext } from '@/utils/session';
import { SessionChapterUser } from '../api/chapters/login';
import {
  RecipientsContext,
  RecipientsProvider,
} from '@/providers/RecipientsProvider';
import RecipientCard from '@/components/RecipientCard';
import NewRecipientModal from '@/components/recipient-modals/NewRecipientModal';
import RecipientDetails from '@/components/RecipientDetails';
import ChapterNavbar from '@/components/navbars/ChapterNavbar';
import prisma from '@/prisma-client';

interface ChapterDashboardProps {
  user: SessionChapterUser;
  chapter: Chapter;
  chapterError?: string;
}

interface RecipientsCardsListProps {
  activeRecipientId: number;
  onRecipientClick: (id: number) => void;
}

function RecipientsCardsList({
  activeRecipientId,
  onRecipientClick,
}: RecipientsCardsListProps) {
  const { recipients, loading, error } = useContext(RecipientsContext);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <Stack spacing="5" maxH="600px" overflowY="auto" pr="2" py="5">
      {recipients.map((x) => (
        <RecipientCard
          recipient={x}
          key={x.id}
          isActive={x.id === activeRecipientId}
          onClick={onRecipientClick}
        />
      ))}
    </Stack>
  );
}

export default function ChapterDashboardPage({
  user,
  chapter,
  chapterError,
}: ChapterDashboardProps) {
  const { chapterId } = user.chapterUser;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeRecipientId, setActiveRecipientId] = useState(-1);

  return (
    <>
      <ChapterNavbar chapterName={chapter.chapterName} />
      <RecipientsProvider chapterId={chapterId}>
        <Box p="10" background="gray.100">
          <Heading textAlign="center">{chapter?.chapterName} Chapter</Heading>

          {chapterError && <Text>{chapterError}</Text>}

          <Grid templateColumns="300px 1fr" my="5" gap="4">
            <Stack spacing="5">
              <Flex
                boxShadow="lg"
                borderRadius="lg"
                borderWidth="1px"
                alignItems="baseline"
                background="white"
                padding="3"
              >
                <Heading size="md">Recipients</Heading>
                <Spacer />
                <Button onClick={onOpen} colorScheme="blue" width="60px">
                  +
                </Button>
              </Flex>
              <RecipientsCardsList
                activeRecipientId={activeRecipientId}
                onRecipientClick={setActiveRecipientId}
              />
            </Stack>

            <RecipientDetails recipientId={activeRecipientId} />
          </Grid>

          <NewRecipientModal isOpen={isOpen} onClose={onClose} />
        </Box>
      </RecipientsProvider>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ChapterDashboardProps> =
  withChapterAuthPage(async ({ req }: NextIronServerSideContext) => {
    const user = req.session.get('user') as SessionChapterUser;

    let chapter: Chapter | null;
    let chapterError = '';
    try {
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
