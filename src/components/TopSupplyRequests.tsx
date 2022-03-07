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
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import useSWR from 'swr';
import { Chapter } from '@prisma/client';
// import { DonorContext } from '@/providers/DonorProvider';
import { GetChapterResponse } from '@/pages/api/chapters';

interface DonorNavbarDropDownProps {
  chapters: Chapter[];
}

export default function TopSupplyRequests({
  chapters,
}: DonorNavbarDropDownProps) {
  // TODO: once endpoint is available, get the list of top supplies, and delete the fake supply list
  // const { data, error } = useSWR<GetChapterResponse>(`/api/chapters`); // change this to have supply request endpoint
  const fakeSupplyList = [
    { item: 'Pencils', id: 1 },
    { item: 'Pens', id: 2 },
    { item: 'Erasers', id: 3 },
    { item: 'Markers', id: 4 },
    { item: 'Crayons', id: 5 },
    { item: 'Notebooks', id: 6 },
    { item: 'Binders', id: 7 },
    { item: 'Pencil Sharpeners', id: 8 },
  ];

  return (
    <Box h="full" p="10%">
      <VStack mr="15%" spacing="10%">
        <Heading size="lg">
          {/* TODO: get the current chapter, and display the name here */}
          [Chapter] Chapter Recipients Needs:
        </Heading>
        <Box w="full" border="2px" borderColor="black">
          <UnorderedList p="5%">
            {fakeSupplyList.map((item) => (
              <ListItem key={item.id}>{item.item}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      </VStack>
    </Box>
  );
}
