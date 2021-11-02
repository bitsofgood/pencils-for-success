import React, { useContext, useState } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Button,
  Text,
  Flex,
  Spacer,
  Divider,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  SimpleGrid,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Chapter } from '@prisma/client';
import {
  ChapterModalContext,
  ModalState,
} from '@/providers/ChapterModalProvider';
import { ChaptersContext } from '@/providers/ChaptersProvider';
import { emailRegex } from '@/utils/prisma-validation';

const EditChapterModal = () => {
  const { activeChapter, setModalState } = useContext(ChapterModalContext);
  const { chapters } = useContext(ChaptersContext);

  const chapterToEdit = chapters[activeChapter];

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Chapter>({
    defaultValues: {
      ...chapterToEdit,
    },
  });

  const onCancel = () => {
    setModalState(ModalState.ViewChapter);
  };

  const onSubmit = async (data: Chapter) => {
    alert('Updating chapter');
  };

  return (
    <ModalContent>
      <ModalHeader>Edit Chapter {chapterToEdit?.chapterName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb="5" mt="5" textAlign="center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            isRequired
            isInvalid={errors.chapterName !== undefined}
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

          <FormControl isRequired>
            <FormLabel>Contact Info</FormLabel>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.contactName !== undefined}
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
            <FormControl
              isRequired
              isInvalid={errors.email !== undefined}
              mb={2}
              id="email"
            >
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

            <FormControl
              isInvalid={errors.phoneNumber !== undefined}
              mb={2}
              id="phoneNumber"
            >
              <Input
                placeholder="Phone Number (Optional)"
                type="number"
                {...register('phoneNumber')}
                borderColor="black"
              />
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <Divider my="5" />

          <Flex>
            <Button colorScheme="blue" isLoading={isSubmitting} type="submit">
              Save
            </Button>
            <Spacer />
            <Button disabled={isSubmitting} onClick={onCancel} variant="ghost">
              Cancel
            </Button>
          </Flex>
        </form>
      </ModalBody>
    </ModalContent>
  );
};

export default EditChapterModal;
