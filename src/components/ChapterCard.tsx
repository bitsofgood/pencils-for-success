import { Heading, Text, Flex, Box } from '@chakra-ui/react';
import React, { useContext } from 'react';
import {
  ChapterModalContext,
  ModalState,
} from '@/providers/ChapterModalProvider';
import { ChapterDetails } from '@/pages/api/chapters/[chapterId]';

interface ChapterCardProps {
  chapter: ChapterDetails;
}

interface ChapterFieldProps {
  label: string;
  text: string;
}

function ChapterCardField({ label, text }: ChapterFieldProps) {
  return (
    <Box pt="2" d="flex">
      <Text mr="1" fontWeight="bold">
        {label}:
      </Text>
      <Text>{text}</Text>
    </Box>
  );
}

function ChapterCard({ chapter }: ChapterCardProps) {
  // const { onOpen, setModalState, setActiveChapter } =
  //   useContext(ChapterModalContext);

  // const onChapterClick = () => {
  //   setActiveChapter(chapter.id);
  //   setModalState(ModalState.ViewChapter);
  //   onOpen();
  // };

  return (
    <Flex
      // onClick={() => onChapterClick()}
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      cursor="pointer"
      direction="column"
      alignItems="baseline"
      padding="5"
    >
      <Heading size="md" mb="2">
        {chapter.chapterName}
      </Heading>
      <ChapterCardField label="Name" text={chapter.contactName} />
      <ChapterCardField
        label="Username"
        text={chapter.chapterUser?.user?.username || ''}
      />
      <ChapterCardField label="Email" text={chapter.email} />
      <ChapterCardField label="Phone Number" text={chapter.phoneNumber || ''} />
    </Flex>
  );
}

export default ChapterCard;
