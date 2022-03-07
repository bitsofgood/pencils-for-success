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
// import { DonorProvider } from '@/providers/DonorProvider';
import TopSupplyRequests from '@/components/TopSupplyRequests';
import InfoAndMapView from '@/components/InfoAndMapView';
import { GetChapterResponse } from './api/chapters';

export default function Home() {
  const { data, error } = useSWR<GetChapterResponse>(`/api/chapters`);

  return (
    // <DonorProvider>
    <div>
      <Head>
        <title>Pencils for Success</title>
        <meta name="description" content="Pencils for Success" />
      </Head>
      <DonorNavbar />
      <HStack h="100vh" pb="3%" top={NAVBAR_HEIGHT}>
        <Box alignSelf="flex-start">
          {data && <TopSupplyRequests chapters={data.chapters} />}
        </Box>

        <Divider
          h="full"
          variant="solid"
          borderColor="black"
          borderWidth="2px"
          orientation="vertical"
        />

        <Box
          position="relative"
          m="0px"
          alignSelf="flex-start"
          w="full"
          h="full"
        >
          {data && <InfoAndMapView chapters={data.chapters} />}
        </Box>
      </HStack>
    </div>
    // </DonorProvider>
  );
}
