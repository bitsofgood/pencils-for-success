<<<<<<< HEAD
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
=======
import React from 'react';
import { Text, Box, Image, Heading } from '@chakra-ui/react';
import PropTypes from 'prop-types';

type ChapterCardProps = {
  name: string;
  image: string;
  contact: string;
  email: string;
};

export default function ChapterCard({
  name,
  image,
  contact,
  email,
}: ChapterCardProps) {
  return (
    <Box w="100%" h={300} borderWidth="1px" borderRadius="lg">
      <Heading>{name}</Heading>
      <Image src={image} alt="" />
      <Text>{contact}</Text>
      <Text>{email}</Text>
>>>>>>> feat(ui): created basic Chapter Card component for admin dashboard
    </Box>
  );
}

<<<<<<< HEAD
export default ChapterCard;
=======
ChapterCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};
>>>>>>> feat(ui): created basic Chapter Card component for admin dashboard
