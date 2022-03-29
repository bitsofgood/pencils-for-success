import {
  Select,
  Text,
  VStack,
  Center,
  Heading,
  Box,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { Chapter } from '@prisma/client';
import Image from 'next/image';
import { DonorContext } from '@/providers/DonorProvider';
import { GetChapterResponse } from '@/pages/api/chapters';
import emptyStateIllo from '../../public/Illo_DonorDashboard.png';
import DonorMap from './DonorMap';

interface DonorNavbarDropDownProps {
  chapters: Chapter[];
}

export default function InfoAndMapView({ chapters }: DonorNavbarDropDownProps) {
  const [infoView, setInfoView] = useState(true);
  const { activeChapterId } = useContext(DonorContext);
  const currentChapter = chapters.find(
    (item) => Number(item.id) === Number(activeChapterId),
  );

  return (
    <>
      <Box
        boxShadow="lg"
        borderRadius="lg"
        borderWidth="1px"
        background="white"
        height="full"
        position="relative"
      >
        {!infoView && <DonorMap />}
        <ButtonGroup
          p="6px"
          spacing="0px"
          bgColor="#EEEEEE"
          borderRadius="lg"
          position="absolute"
          top="16px"
          left="16px"
          boxShadow={infoView ? 'none' : 'lg'}
          variant="unstyled"
        >
          <Button
            borderRadius="lg"
            boxShadow={infoView ? 'md' : 'none'}
            pl="30px"
            pr="30px"
            bgColor={infoView ? 'white' : 'transparent'}
            color={infoView ? 'black' : '#858585'}
            onClick={() => setInfoView(true)}
          >
            Info View
          </Button>
          <Button
            onClick={() => setInfoView(false)}
            borderRadius="lg"
            boxShadow={infoView ? 'none' : 'md'}
            bgColor={infoView ? 'transparent' : 'white'}
            color={infoView ? '#858585' : 'black'}
            pl="30px"
            pr="30px"
          >
            Map View
          </Button>
        </ButtonGroup>
        <Box
          pt="32px"
          flexDirection="column"
          alignItems="center"
          display={!infoView ? 'none' : 'flex'}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Text fontWeight={900} fontSize="24px" mb="16px">
            Want to Donate?
          </Text>
          <Box w="100%" h="auto" position="relative" mb="32px">
            <Image src={emptyStateIllo} alt="hello" objectFit="cover" />
          </Box>
          <Box fontWeight={900} pt="10px" pb="10px">
            Contact:
          </Box>
          <Box>{currentChapter?.contactName}</Box>
          <Box>{currentChapter?.email}</Box>
          <Box>{currentChapter?.phoneNumber}</Box>
        </Box>
      </Box>
    </>
  );
}
