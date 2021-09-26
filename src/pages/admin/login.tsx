import React from 'react';
import { useForm } from 'react-hook-form';
import {
  FormLabel,
  FormControl,
  Input,
  Button,
  Heading,
  FormErrorMessage,
} from '@chakra-ui/react';

import styles from '@/styles/Admin.module.css';

export default function Admin() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }

  return (
    <div className={styles.container}>
      <Heading>Login</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.username}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            placeholder="Username"
            borderColor="black"
            borderRadius="-moz-initial"
            {...register('username', {
              required: 'This is required',
            })}
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            placeholder="Password"
            borderColor="black"
            borderRadius="-moz-initial"
            type="password"
            {...register('password', {
              required: 'This is required',
              minLength: { value: 8, message: 'Minimum length should be 8' },
            })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={4}
          isLoading={isSubmitting}
          type="submit"
          borderColor="black"
          borderRadius="-moz-initial"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
