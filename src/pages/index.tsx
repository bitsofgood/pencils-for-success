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
          spacing="0px"
          background="gray.100"
        >
          <Box
            alignSelf="flex-start"
            h="full"
            w="45%"
            padding="32px"
            paddingRight="16px"
          >
            {data && <TopSupplyRequests chapters={data.chapters} />}
          </Box>

          <Box
            alignSelf="flex-start"
            w="full"
            h="full"
            padding="32px"
            paddingLeft="16px"
          >
            {data && <InfoAndMapView chapters={data.chapters} />}
          </Box>
        </HStack>
      </div>
    </DonorProvider>
  );
}
