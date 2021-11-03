// This is a dummy card to test functionality to view/edit/delete chapter.

import { Heading, Image, Text, Flex } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Chapter } from '@prisma/client';
import {
  ChapterModalContext,
  ModalState,
} from '@/providers/ChapterModalProvider';

interface ChapterCardProps {
  chapter: Chapter;
}

// Issue #42 handles the adding chapter cards to match the mockups
function ChapterCard({ chapter }: ChapterCardProps) {
  const { onOpen, setModalState, setActiveChapter } =
    useContext(ChapterModalContext);

  const onChapterClick = () => {
    setActiveChapter(chapter.id);
    setModalState(ModalState.ViewChapter);
    onOpen();
  };

  return (
    <Flex
      onClick={() => onChapterClick()}
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      cursor="pointer"
      direction="column"
      alignItems="baseline"
      padding="5"
    >
      <Heading size="md" paddingBottom="5">
        {chapter.chapterName}
      </Heading>
      <Image
        src="https://picsum.photos/200"
        alt=""
        w="95%"
        alignSelf="center"
        borderRadius="xl"
      />
      <Text paddingTop="2">{chapter.contactName}</Text>
      <Text paddingTop="2">{chapter.email}</Text>
      <Text paddingTop="2">{chapter.phoneNumber}</Text>
    </Flex>
  );
}

export default ChapterCard;
