// This is a dummy card to test functionality to view/edit/delete chapter.

import { Box } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { ChapterModalContext } from '@/providers/ChapterModalProvider';

// Issue #42 handles the adding chapter cards to match the mockups
function ChapterCard() {
  const { onOpen, setModalState, setActiveChapter } =
    useContext(ChapterModalContext);

  const onChapterClick = (id: number) => {
    setActiveChapter(id);
    // setModalState(ModalState.ViewChapter);
    onOpen();
  };

  return (
    <Box
      onClick={() => onChapterClick(1)}
      boxShadow="lg"
      borderRadius="md"
      borderWidth="1px"
      cursor="pointer"
      py="5"
    >
      Chapter 1
    </Box>
  );
}

export default ChapterCard;
