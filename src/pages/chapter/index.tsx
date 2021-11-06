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
} from '@chakra-ui/react';
import { Chapter, PrismaClient } from '@prisma/client';
import { withChapterAuthPage } from '@/utils/middlewares/auth';
import { SessionAdminUser } from '../api/admin/login';
import { NextIronServerSideContext } from '@/utils/session';
import ChapterCard from '@/components/ChapterCard';
import { ChaptersContext } from '@/providers/ChaptersProvider';
import { SessionChapterUser } from '../api/chapters/login';

interface ChapterDashboardProps {
  user: SessionAdminUser;
  chapter: Chapter;
  chapterError?: string;
}

function ChapterCardsGrid() {
  const { chapters } = useContext(ChaptersContext);

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} my="5" spacing="5">
      {Object.values(chapters).map((x) => (
        <ChapterCard chapter={x} key={x.id} />
      ))}
    </SimpleGrid>
  );
}

export default function AdminDashboardPage({
  user,
  chapter,
  chapterError,
}: ChapterDashboardProps) {
  return (
    <Box p="10">
      <Flex>
        <Heading>{chapter?.chapterName} Chapter</Heading>
        <Spacer />
        <Button colorScheme="blue">+ Add New</Button>
      </Flex>

      {chapterError && <Text>{chapterError}</Text>}
    </Box>
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
