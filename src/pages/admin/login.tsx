import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  FormLabel,
  FormControl,
  Input,
  Button,
  Heading,
  FormErrorMessage,
} from '@chakra-ui/react';

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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Heading mb="2vh">Login</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.username} mt={2} mb={2}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            placeholder="Username"
            {...register('username', {
              required: 'Username is required',
            })}
            borderColor="black"
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
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum length should be 8' },
            })}
            borderColor="black"
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
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
