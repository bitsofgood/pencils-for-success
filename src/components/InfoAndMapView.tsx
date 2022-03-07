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
import { DonorContext } from '@/providers/DonorProvider';
import { GetChapterResponse } from '@/pages/api/chapters';
import DonorMap from './DonorMap';

interface DonorNavbarDropDownProps {
  chapters: Chapter[];
}

export default function InfoAndMapView({ chapters }: DonorNavbarDropDownProps) {
  const [infoView, setInfoView] = useState(true);

  return (
    <>
      {!infoView && <DonorMap />}
      <ButtonGroup p="5%" variant="outline" spacing="0px">
        <Button
          borderRadius="0"
          pl="30px"
          pr="30px"
          borderColor="black"
          bgColor={infoView ? 'black' : 'white'}
          color={infoView ? 'white' : 'black'}
          onClick={() => setInfoView(true)}
        >
          Info View
        </Button>
        {/* TODO: get the current chapter and display its contact info */}
        <Button
          onClick={() => setInfoView(false)}
          borderRadius="0"
          borderColor="black"
          bgColor={infoView ? 'white' : 'black'}
          color={infoView ? 'black' : 'white'}
          pl="30px"
          pr="30px"
        >
          Map View
        </Button>
      </ButtonGroup>
    </>
  );
}
