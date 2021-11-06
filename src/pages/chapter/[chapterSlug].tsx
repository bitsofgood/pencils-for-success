import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
} from '@chakra-ui/react';
import { PrismaClient, Chapter, Recipient } from '@prisma/client';
import React from 'react';
import RecipientCard from '@/components/RecipientCard';

type ChapterWithRecipients = Chapter & {
  recipients: Recipient[];
};

interface ChapterMapPageProps {
  chapter: ChapterWithRecipients;
}

interface IStaticPropsContextParams {
  params: {
    chapterSlug: string;
  };
}

function AddNewRecipientButton() {
  const onNewRecipientClick = () => {
    alert('Open modal to create new recipient');
  };

  return (
    <Button onClick={onNewRecipientClick} colorScheme="blue">
      + Add New
    </Button>
  );
}

interface RecipientCardProps {
  recipients: Recipient[];
}

function RecipientCardsGrid({ recipients }: RecipientCardProps) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} my="5" spacing="5">
      {recipients.map((x) => (
        <RecipientCard recipient={x} key={x.id} />
      ))}
    </SimpleGrid>
  );
}

export default function ChapterMapPage({ chapter }: ChapterMapPageProps) {
  return (
    <Box p="10">
      <Flex>
        <Heading>{chapter.chapterName} Chapter Recipients</Heading>
        <Spacer />
        <AddNewRecipientButton />
      </Flex>

      <RecipientCardsGrid recipients={chapter.recipients || []} />
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
  // TODO - Figure out how to allow case insensitive searches in Prisma
  const { chapterSlug } = params;

  const prisma = new PrismaClient();
  const chapter = await prisma.chapter.findUnique({
    where: {
      chapterSlug,
    },
    include: {
      recipients: true,
    },
  });

  return { props: { chapter } };
}
