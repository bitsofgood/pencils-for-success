import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import DonorMap from '@/components/DonorMap';
import DonorNavbar from '@/components/navbars/DonorNavbar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pencils for Success</title>
        <meta name="description" content="Pencils for Success" />
      </Head>
      <DonorNavbar />
      <Box position="absolute" top="55px" bottom="0" left="0" right="0">
        <DonorMap />
      </Box>
    </div>
  );
}
