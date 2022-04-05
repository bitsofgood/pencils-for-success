import {
  VStack,
  Heading,
  Box,
  ListItem,
  UnorderedList,
  Flex,
} from '@chakra-ui/react';
import { useContext } from 'react';
import useSWR from 'swr';
import { Chapter } from '@prisma/client';
import { DonorContext } from '@/providers/DonorProvider';
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
    <Box
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      background="white"
      height="100%"
      padding="32px"
    >
      <Flex mr="15%" spacing="10%" direction="column">
        <Heading size="lg">
          {currentChapter?.chapterName} Recipients Needs:
        </Heading>
        <Box w="full" border="2px" borderColor="black">
          <UnorderedList p="5%" spacing="15px">
            {data &&
              data.topSupplyRequests?.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
          </UnorderedList>
        </Box>
      </Flex>
    </Box>
  );
}
