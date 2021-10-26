import React, { useContext } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  SimpleGrid,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ChapterModalContext } from '@/providers/ChapterModalProvider';
import { emailRegex } from '@/utils/prisma-validation';

interface NewChapterFormBody {
  chapterName: string;
  username: string;
  password: string;
  contactName: string;
  email: string;
  phoneNumber: string;
}

const createNewChapter = async (data: NewChapterFormBody) => {
  const { chapterName, username, password, contactName, email, phoneNumber } =
    data;

  const chapter = {
    email,
    contactName: chapterName,
  };

  const newUser = {
    name: contactName,
    email,
    phoneNumber,
    username,
    hash: password,
  };

  const response = await fetch('/api/chapters', {
    method: 'POST',
    body: JSON.stringify({
      chapter,
      newUser,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
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

const NewChapterModal = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const { onClose } = useContext(ChapterModalContext);

  const onSubmit = async (x: NewChapterFormBody) => {
    try {
      const response = await createNewChapter(x);
      onClose();
      alert(response.message);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <ModalContent>
      <ModalHeader>Create New Chapter</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb="5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            isInvalid={errors.chapterName}
            mt={2}
            mb={2}
            id="chapterName"
          >
            <FormLabel htmlFor="chapterName">Chapter Name</FormLabel>
            <Input
              placeholder="Enter Name"
              {...register('chapterName', {
                required: 'Chapter Name is required',
              })}
              borderColor="black"
            />
            <FormErrorMessage>
              {errors.chapterName && errors.chapterName.message}
            </FormErrorMessage>
          </FormControl>

          <FormLabel htmlFor="credentials">Credentials</FormLabel>
          <FormControl
            isInvalid={errors.username}
            mt={2}
            mb={2}
            id="chapterName"
          >
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
            <Input
              placeholder="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Minimum length should be 8',
                },
              })}
              borderColor="black"
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <FormLabel htmlFor="contact">Contact Info</FormLabel>
          <FormControl
            isInvalid={errors.contactName}
            mt={2}
            mb={2}
            id="contactName"
          >
            <Input
              placeholder="Contact Name"
              {...register('contactName', {
                required: 'Contact name is required',
              })}
              borderColor="black"
            />
            <FormErrorMessage>
              {errors.contactName && errors.contactName.message}
            </FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={[1, null, 2]} spacing={[0, null, 5]}>
            <FormControl isInvalid={errors.email} mb={2} id="email">
              <Input
                placeholder="Email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: emailRegex,
                    message: 'Invalid email address',
                  },
                })}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.phoneNumber} mb={2} id="phoneNumber">
              <Input
                placeholder="Phone Number"
                type="number"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                })}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={[1, null, 2]} spacing={[0, null, 5]} mt="4">
            <Button
              isLoading={isSubmitting}
              type="submit"
              colorScheme="messenger"
            >
              Submit
            </Button>
            <Button
              isLoading={isSubmitting}
              onClick={onClose}
              disabled={isSubmitting}
              variant="ghost"
            >
              Cancel
            </Button>
          </SimpleGrid>
        </form>
      </ModalBody>
    </ModalContent>
  );
};

export default NewChapterModal;
