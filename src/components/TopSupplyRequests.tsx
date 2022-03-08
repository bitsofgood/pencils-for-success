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
import { DonorContext } from '@/providers/DonorProvider';
import { GetChapterResponse } from '@/pages/api/chapters';
import { DataResponse } from '@/pages/api/chapters/[chapterId]/supply-requests/top';

interface DonorNavbarDropDownProps {
  chapters: Chapter[];
}

export default function TopSupplyRequests({
  chapters,
}: DonorNavbarDropDownProps) {
  const { activeChapterId } = useContext(DonorContext);
  // Emily's change
  const { data, error } = useSWR<DataResponse>(
    `/api/chapters/${activeChapterId}/supply-requests/top`,
  );
  const currentChapter = chapters.find(
    (item) => Number(item.id) === Number(activeChapterId),
  );

  return (
    <Box h="full" p="10%">
      <VStack mr="15%" spacing="10%">
        <Heading size="lg">
          {currentChapter?.chapterName} Chapter Recipients Needs:
        </Heading>
        <Box w="full" border="2px" borderColor="black">
          <UnorderedList p="5%">
            {data &&
              data.supplyRequests.map((item) => (
                <ListItem key={item.id}>{item.item.name}</ListItem>
              ))}
          </UnorderedList>
        </Box>
      </VStack>
    </Box>
  );
}
