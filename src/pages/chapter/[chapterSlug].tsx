import { Box, Flex, Heading, Spacer } from '@chakra-ui/react';
import { PrismaClient, Chapter } from '@prisma/client';
import React from 'react';

interface ChapterMapPageProps {
  chapter: Chapter;
}

interface IStaticPropsContextParams {
  params: {
    chapterSlug: string;
  };
}

export default function ChapterDashboardPage({ chapter }: ChapterMapPageProps) {
  return (
    <Box p="10">
      <Flex>
        <Heading>{chapter.chapterName} Chapter </Heading>
        <Spacer />
      </Flex>
    </Box>
  );
}

export async function getStaticPaths() {
  const prisma = new PrismaClient();
  const rawChapters = await prisma.chapter.findMany({
    select: {
      chapterSlug: true,
    },
  });

  const chapters = rawChapters.map((x) => x.chapterSlug);

  const paths = chapters.map((chapterSlug) => ({
    params: { chapterSlug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: IStaticPropsContextParams) {
  const { chapterSlug } = params;

  const prisma = new PrismaClient();
  const chapter = await prisma.chapter.findUnique({
    where: {
      chapterSlug,
    },
  });

  return { props: { chapter } };
}
