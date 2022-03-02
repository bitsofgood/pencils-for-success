import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import DonorMap from '@/components/DonorMap';
import DonorNavbar from '@/components/navbars/DonorNavbar';
import { NAVBAR_HEIGHT } from '@/styles/theme';
import { DonorProvider } from '@/providers/DonorProvider';

export default function Home() {
  return (
    <DonorProvider>
      <div>
        <Head>
          <title>Pencils for Success</title>
          <meta name="description" content="Pencils for Success" />
        </Head>
        <DonorNavbar />
        <Box
          position="absolute"
          top={NAVBAR_HEIGHT}
          bottom="0"
          left="0"
          right="0"
        >
          <DonorMap />
        </Box>
      </div>
    </DonorProvider>
  );
}
