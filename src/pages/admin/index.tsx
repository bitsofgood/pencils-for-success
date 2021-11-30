import React, { useContext } from 'react';
import { GetServerSideProps } from 'next';
import {
  SimpleGrid,
  Heading,
  Text,
  Divider,
  Button,
  Box,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { Chapter } from '@prisma/client';
import { withAdminAuthPage } from '@/utils/middlewares/auth';
import { SessionAdminUser } from '../api/admin/login';
import { NextIronServerSideContext } from '@/utils/session';
import ChapterModalController from '@/components/chapter-modals/ChapterModalController';
import {
  ChapterModalContext,
  ChapterModalProvider,
  ModalState,
} from '@/providers/ChapterModalProvider';
import ChapterCard from '@/components/ChapterCard';
import {
  ChaptersContext,
  ChaptersProvider,
} from '@/providers/ChaptersProvider';
import { ChapterDetails } from '../api/chapters/[chapterId]';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import prisma from '@/prisma-client';

interface AdminDashboardProps {
  user: SessionAdminUser;
  chapters: ChapterDetails[];
  chapterError?: string;
}

function AddNewChapterButton() {
  const { onOpen, setModalState } = useContext(ChapterModalContext);

  const onNewChapterClick = () => {
    setModalState(ModalState.NewChapter);
    onOpen();
  };

  return <Button onClick={onNewChapterClick}>+ Add New</Button>;
}

function ChapterCardsGrid() {
  const { chapters } = useContext(ChaptersContext);

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} my="5" spacing="5">
      {Object.values(chapters).map((x) => (
        <ChapterCard chapter={x} key={x.id} />
      ))}
    </SimpleGrid>
  );
}

export default function AdminDashboardPage({
  chapters,
  chapterError,
}: AdminDashboardProps) {
  return (
    <>
      <AdminNavbar />
      <ChaptersProvider initChapters={chapters}>
        <ChapterModalProvider>
          <Box p="10" textAlign="center">
            <Heading>Admin Dashboard</Heading>
            <Divider my={3} />

            <Flex>
              <Heading>Chapters</Heading>
              <Spacer />
              <AddNewChapterButton />
            </Flex>

            {chapterError && <Text>{chapterError}</Text>}

            <ChapterCardsGrid />

            <ChapterModalController />
          </Box>
        </ChapterModalProvider>
      </ChaptersProvider>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<AdminDashboardProps> =
  withAdminAuthPage(async ({ req }: NextIronServerSideContext) => {
    const user = req.session.get('user') as SessionAdminUser;

    let chapters: Chapter[] = [];
    let chapterError = '';
    try {
      chapters = await prisma.chapter.findMany({
        include: {
          chapterUser: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (e) {
      chapters = [];
      chapterError = 'Failed to retrieve the chapters. Please try again later';
    }

    return {
      props: { user, chapters, chapterError },
    };
  });
