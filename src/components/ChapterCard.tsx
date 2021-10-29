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
    </Box>
  );
}

ChapterCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};
