import Head from 'next/head';
import {
  Box,
  HStack,
  Divider,
  Center,
  StackDivider,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { useState } from 'react';
import useSWR from 'swr';
import DonorMap from '@/components/DonorMap';
import DonorNavbar from '@/components/navbars/DonorNavbar';
import { NAVBAR_HEIGHT } from '@/styles/theme';
import TopSupplyRequests from '@/components/TopSupplyRequests';
import InfoAndMapView from '@/components/InfoAndMapView';
import { GetChapterResponse } from './api/chapters';
import { DonorProvider } from '@/providers/DonorProvider';

export default function Home() {
  const { data, error } = useSWR<GetChapterResponse>(`/api/chapters`);

  return (
    <DonorProvider>
      <div>
        <Head>
          <title>Pencils for Success</title>
          <meta name="description" content="Pencils for Success" />
        </Head>
        <DonorNavbar />
        <HStack
          h="94vh"
          top={NAVBAR_HEIGHT}
          divider={<StackDivider borderWidth="2px" borderColor="black" />}
          spacing="0px"
        >
          <Box alignSelf="flex-start">
            {data && <TopSupplyRequests chapters={data.chapters} />}
          </Box>

          <Box
            position="relative"
            m="0px"
            w="full"
            h="full"
            alignSelf="flex-start"
          >
            {data && <InfoAndMapView chapters={data.chapters} />}
          </Box>
        </HStack>
      </div>
    </DonorProvider>
  );
}
