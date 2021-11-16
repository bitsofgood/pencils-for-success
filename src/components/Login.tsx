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
  directURL: string;
  title: string;
};

const postCredentials = async (
  apiURL: string,
  username: string,
  password: string,
) => {
  const response = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const responseJson = await response.json();
  if (response.status !== 200) {
    throw Error(responseJson.message);
  }

  if (responseJson.error) {
    throw Error(responseJson.message);
  }

  return responseJson;
};

const Login = ({ apiURL, directURL, title }: LoginProps) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    postCredentials(apiURL, username, password)
      .then(() => {
        router.replace(directURL);
      })
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
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

Login.propTypes = {
  apiURL: PropTypes.string.isRequired,
  directURL: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Login;
