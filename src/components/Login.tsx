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
  Link,
  Text,
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

  const renderLoginLinks = () => {
    if (title === 'Admin') {
      return (
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Link fontSize="18px" mt="64px" href="/chapter/login">
            Need to login as a chapter?
          </Link>
          <Link fontSize="18px" mt="4px" href="/recipient/login">
            Need to login as a recipient?
          </Link>
        </Box>
      );
    }

    if (title === 'Chapter') {
      return (
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Link fontSize="18px" mt="64px" href="/admin/login">
            Need to login as an admin?
          </Link>
          <Link fontSize="18px" mt="4px" href="/recipient/login">
            Need to login as a recipient?
          </Link>
        </Box>
      );
    }

    return (
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Link fontSize="18px" mt="64px" href="/admin/login">
          Need to login as an admin?
        </Link>
        <Link fontSize="18px" mt="4px" href="/chapter/login">
          Need to login as a chapter?
        </Link>
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        pt={8}
        width="41.667vw"
        height="100vh"
        textAlign="start"
        pl="8.333vw"
      >
        <Heading mb="4px" fontSize="48px" mt="-24px">
          {title} Login
        </Heading>
        <Text fontSize="24px" mb="16px">
          Pencils for Success Donation Portal
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.username} mt={3} mb={3} id="username">
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              placeholder="Username"
              {...register('username', {
                required: 'Username is required',
              })}
              borderColor="black"
              width="25vw"
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password} id="password">
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              placeholder="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum length should be 8' },
              })}
              borderColor="black"
              width="25vw"
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            mt={6}
            isLoading={isSubmitting}
            type="submit"
            width="25vw"
            colorScheme="blue"
            fontSize="xl"
            padding="6"
          >
            Login
          </Button>
          {renderLoginLinks()}
        </form>
      </Box>
      <Box
        height="100vh"
        width="58.333vw"
        backgroundColor="#0A5093"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Text
          fontWeight="light"
          color="white"
          fontSize="64px"
          width="41.667vw"
          mb="32px"
          ml="8.333vw"
        >
          Our mission is to provide underprivileged students of the world with
          essential school supplies.
        </Text>
        <Text
          fontWeight="light"
          color="white"
          fontSize="32px"
          width="41.667vw"
          ml="8.333vw"
        >
          Thank you for being a part of our cause to empower learning and
          education for young students.
        </Text>
      </Box>
    </Box>
  );
};

Login.propTypes = {
  apiURL: PropTypes.string.isRequired,
  directURL: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Login;
