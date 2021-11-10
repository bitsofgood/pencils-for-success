import Head from 'next/head';
import Image from 'next/image';

import styles from '@/styles/Home.module.css';
import DonorNavBar from '@/components/donorNavbar';

export default function Home() {
  return (
    <div>
      <DonorNavBar />

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
