import Image from 'next/image';

import { Box } from '@chakra-ui/react';
import styles from '@/styles/Home.module.css';
import classes from '@/pages/chapters/portal.module.css';

// import NavBar from '@/components/navbar';
// import DonorNavBar from '@/components/donorNavbar';

export default function ChapterPortal() {
  return (
    <div className={styles.container}>
      <div className={classes.title}>
        <h1>Texas Chapter Recipients</h1>
      </div>

      <div className={classes.container}>
        <Box className={classes.cell}>
          <p className={classes.cellTitle}>Texas School #1</p>
          <p className={classes.cellText}> 5 Pending Supply Requests</p>
        </Box>
        <Box className={classes.cell}>
          <p className={classes.cellTitle}>Texas School #2</p>
          <p className={classes.cellText}> 5 Pending Supply Requests</p>
        </Box>
        <Box className={classes.cell}>
          <p className={classes.cellTitle}>Texas School #3</p>
          <p className={classes.cellText}> 5 Pending Supply Requests</p>
        </Box>
        <Box className={classes.cell}>
          <p className={classes.cellTitle}>Texas School #4</p>
          <p className={classes.cellText}> 5 Pending Supply Requests</p>
        </Box>
        <Box className={classes.cell}>
          <p className={classes.cellTitle}>Texas School #5</p>
          <p className={classes.cellText}> 5 Pending Supply Requests</p>
        </Box>
        <Box className={classes.cell}>
          <p className={classes.cellTitle}>Texas School #6</p>
          <p className={classes.cellText}> 5 Pending Supply Requests</p>
        </Box>
        <Box className={classes.cell}>
          <p className={classes.cellTitle}>Texas School #7</p>
          <p className={classes.cellText}> 5 Pending Supply Requests</p>
        </Box>
        <Box className={classes.cell}>
          <p className={classes.cellTitle}>Texas School #8</p>
          <p className={classes.cellText}> 5 Pending Supply Requests</p>
        </Box>
      </div>

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
