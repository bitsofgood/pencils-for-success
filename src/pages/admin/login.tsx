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
      <Heading mb="2vh">Login</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.username} mt={2} mb={2}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            placeholder="Username"
            {...register('username', {
              required: 'This is required',
            })}
            borderColor="black"
            borderRadius="-moz-initial"
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password} mb={2}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            placeholder="Password"
            type="password"
            {...register('password', {
              required: 'This is required',
              minLength: { value: 8, message: 'Minimum length should be 8' },
            })}
            borderColor="black"
            borderRadius="-moz-initial"
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
