import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

type LoginProps = {
  apiURL: string;
  replaceURL: string;
  title: string;
};

const Login = ({ apiURL, replaceURL, title }: LoginProps) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  let inputs: any;

  const onSubmit = () => {
    fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify(inputs),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => router.replace(replaceURL))
      // eslint-disable-next-line no-alert
      .catch((error) => window.alert(error.message));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={8}
    >
      <Heading mb={4}>{title} Login</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.username} mt={2} mb={2} id="username">
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
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
        <FormControl isInvalid={errors.password} mb={2} id="password">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
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
          onClick={() => {
            inputs = getValues(['username', 'password']);
          }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

Login.propTypes = {
  apiURL: PropTypes.string.isRequired,
  replaceURL: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Login;
