import React from 'react';
import {
  FormLabel,
  FormControl,
  Input,
  Button,
  Heading,
} from '@chakra-ui/react';

import styles from '@/styles/Admin.module.css';

export default function Admin() {
  return (
    <div className={styles.container}>
      <Heading>Login</Heading>
      <form>
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input id="username" placeholder="username" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input id="password" placeholder="password" />
        </FormControl>
        <Button mt={4} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
