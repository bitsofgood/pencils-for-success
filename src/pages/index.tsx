import Head from 'next/head';
import Image from 'next/image';

import { HStack } from '@chakra-ui/react';
import styles from '@/styles/Home.module.css';
import NavBar from '@/components/navbar';
import DonorNavBar from '@/components/donorNavbar';

export default function Home() {
  return (
    <div className={styles.container}>
      <NavBar>
        <HStack
          borderWidth={3}
          borderColor="black"
          spacing={1000}
          alignItems="center"
        >
          <h1>Pencils for Success</h1>
          <DonorNavBar />
        </HStack>
      </NavBar>

      <Head>
        <title>Pencils for Success</title>
        <meta name="description" content="Pencils for Success" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Pencils for Success</h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=typescript-nextjs-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{` `}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
