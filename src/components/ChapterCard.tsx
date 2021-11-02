// This is a dummy card to test functionality to view/edit/delete chapter.

import { Box } from '@chakra-ui/react';
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
    <Box
      onClick={() => onChapterClick()}
      boxShadow="lg"
      borderRadius="md"
      borderWidth="1px"
      cursor="pointer"
      py="5"
    >
      {chapter.chapterName}
    </Box>
  );
}

export default ChapterCard;
