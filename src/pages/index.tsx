import Head from 'next/head';
import DonorMap from '@/components/DonorMap';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pencils for Success</title>
        <meta name="description" content="Pencils for Success" />
      </Head>
      <DonorMap />
    </div>
  );
}
