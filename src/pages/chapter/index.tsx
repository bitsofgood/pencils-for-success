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
import { RecipientModalProvider } from '@/providers/RecipientModalProvider';
import NewRecipientModal from '@/components/recipient-modals/NewRecipientModal';
import RecipientDetails from '@/components/RecipientDetails';
import ChapterNavbar from '@/components/navbars/ChapterNavbar';
import prisma from '@/prisma-client';
import { CredentialsModalProvider } from '@/providers/CredentialsModalProvider';
import CredentialsModalController from '@/components/credential-modals/CredentialsModalController';
import RecipientModalController from '@/components/recipient-modals/RecipientModalController';

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
    <Box height="100vh" overflowY="hidden" background="gray.100">
      <CredentialsModalProvider user={user}>
        <>
          <ChapterNavbar chapterName={chapter.chapterName} />
          <CredentialsModalController />
        </>
      </CredentialsModalProvider>
      <RecipientsProvider chapterId={chapterId}>
        <RecipientModalProvider>
          <Box p="10" background="gray.100">
            <Heading textAlign="center">{chapter?.chapterName}</Heading>

            {chapterError && <Text>{chapterError}</Text>}

            <Grid templateColumns="300px 1fr" my="5" gap="4">
              <Stack spacing="5">
                <Flex
                  boxShadow="md"
                  borderRadius="lg"
                  borderWidth="1px"
                  alignItems="baseline"
                  background="white"
                  pt="2"
                  pb="2"
                  pl="4"
                  pr="4"
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
                <RecipientModalController />
              </Stack>

              <RecipientDetails recipientId={activeRecipientId} />
            </Grid>

            <NewRecipientModal isOpen={isOpen} onClose={onClose} />
          </Box>
        </RecipientModalProvider>
      </RecipientsProvider>
    </Box>
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
