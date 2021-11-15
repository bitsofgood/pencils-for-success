import { Chapter } from '@prisma/client';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ChapterModalContext,
  ModalState,
} from '@/providers/ChapterModalProvider';
import { emailRegex, validateChapterInput } from '@/utils/prisma-validation';
import { ChapterDetails } from '@/pages/api/chapters/[chapterId]';
import { ChaptersContext } from '@/providers/ChaptersProvider';
import EditConfirmationModal from './EditConfirmationModal';

interface ChapterInformationFormProps {
  chapterToEdit: Chapter;
}

const editChapter = async (id: number, updatedChapter: Chapter) => {
  validateChapterInput(updatedChapter);

  const response = await fetch(`/api/chapters/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ updatedChapter }),
  });

  const responseJson = await response.json();
  if (response.status !== 200) {
    throw Error(responseJson.message);
  }

  if (responseJson.error) {
    throw Error(responseJson.message);
  }

  return responseJson.chapter as ChapterDetails;
};

const ChapterInformationForm = ({
  chapterToEdit,
}: ChapterInformationFormProps) => {
  const { activeChapter, setModalState } = useContext(ChapterModalContext);
  const { upsertChapter } = useContext(ChaptersContext);

  const [editedChapter, setEditedChapter] = useState<Chapter>(chapterToEdit);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedChapter(chapterToEdit);
  }, [chapterToEdit]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Chapter>({
    defaultValues: {
      ...chapterToEdit,
    },
  });

  // Manage edit confirmation modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCancel = () => {
    setModalState(ModalState.ViewChapter);
  };

  const onSubmit = async (data: Chapter) => {
    // If valid inputs, open confirmfation modal
    setEditedChapter(data);
    onOpen();
  };

  const onConfirmation = async () => {
    setLoading(true);
    editChapter(activeChapter, editedChapter)
      .then((newChapter) => {
        upsertChapter(newChapter);
        setModalState(ModalState.ViewChapter);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <EditConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirmation={onConfirmation}
        chapter={chapterToEdit}
        message="This action will update chapter"
      />
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

        <Flex my="2">
          <Button
            colorScheme="blue"
            isLoading={isSubmitting || loading}
            disabled={!isDirty}
            type="submit"
          >
            Save
          </Button>

          <Spacer />

          <Button
            disabled={isSubmitting || loading}
            onClick={onCancel}
            variant="ghost"
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default ChapterInformationForm;
