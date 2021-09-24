// import Head from 'next/head';
import Image from 'next/image';

import { Box } from '@chakra-ui/react';
import styles from '@/styles/Home.module.css';
import classes from '@/styles/index.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* <Head>
        <title>Pencils for Success</title>
        <meta name="description" content="Pencils for Success" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <div className={classes.title}>
        <h1>Select Your Chapter</h1>
      </div>

      <div className={classes.container}>
        <Box className={classes.cell}>
          <div className={classes.circlePic}>
            <Image src="/Ellipse1.png" width={120} height={120} />
          </div>
          <p className={classes.cellTitle}>Georgia</p>
        </Box>
        <Box className={classes.cell}>
          <div className={classes.circlePic}>
            <Image src="/Ellipse1.png" width={120} height={120} />
          </div>
          <p className={classes.cellTitle}>Kansas</p>
        </Box>
        <Box className={classes.cell}>
          <div className={classes.circlePic}>
            <Image src="/Ellipse1.png" width={120} height={120} />
          </div>
          <p className={classes.cellTitle}>Texas</p>
        </Box>
      </div>

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
